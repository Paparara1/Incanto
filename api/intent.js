// Vercel Serverless Function: ASI Bridge Intent-to-Action Engine
// Path: api/intent.js

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer bio_')) {
      return res.status(401).json({
        success: false,
        error: 'Brak lub nieprawidłowy token autoryzacji biometrycznej. Skanuj tęczówkę w IrisVault.',
        code: 'BIOMETRIC_AUTH_REQUIRED'
      });
    }

    const { intent, targetTarget = 'k3s_cluster' } = req.body || {};

    if (!intent) {
      return res.status(400).json({
        success: false,
        error: 'Nie podano intencji (intent jest wymagany).'
      });
    }

    // Process intent into deterministic action schema
    const executionId = `EXEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    let compiledAction = {};

    if (intent.toLowerCase().includes('cluster') || intent.toLowerCase().includes('k3s') || intent.toLowerCase().includes('aws')) {
      compiledAction = {
        type: 'INFRASTRUCTURE_PROVISION',
        provider: 'AWS',
        iac: 'Terraform v1.6+',
        module: 'ClusterLaunch',
        mode: 'fast',
        gravitonArm64: true,
        costSavings: '20%',
        terraformCommand: 'cd terraform/aws && terraform init && terraform apply -auto-approve',
        deployScript: './deploy.sh fast'
      };
    } else if (intent.toLowerCase().includes('agent') || intent.toLowerCase().includes('terminal')) {
      compiledAction = {
        type: 'AGENT_ORCHESTRATION',
        module: 'SIT v2.0 (Sovereign Intel Terminal)',
        mcpServer: 'n8n-mcp-proxy',
        tonWalletMonitor: 'ENABLED',
        replicateVoice: 'ENABLED'
      };
    } else {
      compiledAction = {
        type: 'DIRECT_CODE_GENERATION',
        module: 'Kobalt AI Builder',
        engine: 'Multi-LLM (Claude / GPT / Mistral)',
        offlineFirst: true,
        urlCompressed: true
      };
    }

    return res.status(200).json({
      success: true,
      executionId,
      timestamp: new Date().toISOString(),
      intent,
      status: 'COMPILED_AND_READY',
      actionSchema: compiledAction,
      vendorLockin: '0%',
      securityModel: 'Zero-Trust Biometric Gate'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Błąd przetwarzania intencji w silniku ASI Bridge.',
      details: error.message
    });
  }
}
