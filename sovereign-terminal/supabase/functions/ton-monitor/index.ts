import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TON_ADDRESS = "UQCZZjB4GRDJISKKQ-eYfEWzhQ53K7yYbDoUZwpaNAVFgi9F";
const TONCENTER_URL = `https://toncenter.com/api/v2/getAddressInformation?address=${TON_ADDRESS}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // 1. Fetch real balance from TON blockchain
    const tonRes = await fetch(TONCENTER_URL);
    if (!tonRes.ok) {
      throw new Error(`TONCenterAPI error: ${tonRes.status}`);
    }
    const tonData = await tonRes.json();

    if (!tonData.ok || !tonData.result) {
      throw new Error(`TONCenter returned: ${JSON.stringify(tonData)}`);
    }

    const balanceNanoton = BigInt(tonData.result.balance || "0");
    const balanceTon = Number(balanceNanoton) / 1_000_000_000;

    console.log(`[TON Monitor] Address: ${TON_ADDRESS}`);
    console.log(`[TON Monitor] Balance: ${balanceTon} TON (${balanceNanoton} nanoton)`);

    // 2. Get previous balance
    const { data: lastEntry } = await supabase
      .from("ton_balance_log")
      .select("balance_ton")
      .eq("address", TON_ADDRESS)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    const previousBalance = lastEntry?.balance_ton ? Number(lastEntry.balance_ton) : null;
    const isInbound = previousBalance !== null && balanceTon > previousBalance;

    console.log(`[TON Monitor] Previous: ${previousBalance ?? "N/A"} TON | Inbound: ${isInbound}`);

    // 3. Store new balance
    const { error: insertError } = await supabase.from("ton_balance_log").insert({
      address: TON_ADDRESS,
      balance_nanoton: Number(balanceNanoton),
      balance_ton: balanceTon,
      previous_balance_ton: previousBalance,
      is_inbound: isInbound,
    });

    if (insertError) {
      console.error("[TON Monitor] Insert error:", insertError);
    }

    // 4. If inbound detected, send WhatsApp notification
    let whatsappSent = false;
    if (isInbound) {
      const diff = (balanceTon - (previousBalance || 0)).toFixed(4);
      console.log(`[TON Monitor] 🚨 INBOUND DETECTED! +${diff} TON`);

      try {
        const phone = "4915210200523";
        const apikey = "3196815";
        const message = `Ojjja! 💰 Real TON received in Vault! +${diff} TON | New balance: ${balanceTon.toFixed(4)} TON`;

        const encoded = encodeURIComponent(message);
        const callmebotUrl = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encoded}&apikey=${apikey}`;

        const whatsappRes = await fetch(callmebotUrl);
        whatsappSent = whatsappRes.ok;
        console.log(`[TON Monitor] WhatsApp notification: ${whatsappSent ? "SENT" : "FAILED"}`);
      } catch (whatsappErr) {
        console.error("[TON Monitor] WhatsApp error:", whatsappErr);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      address: TON_ADDRESS,
      balance_ton: balanceTon,
      balance_nanoton: Number(balanceNanoton),
      previous_balance_ton: previousBalance,
      is_inbound: isInbound,
      whatsapp_sent: whatsappSent,
      state: tonData.result.state,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[TON Monitor] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
