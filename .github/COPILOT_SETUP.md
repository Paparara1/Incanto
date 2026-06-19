# GitHub Copilot & Enterprise Trial Configuration

This repository is part of the **incantoco** (or **incantocore**) GitHub Enterprise.

## Enterprise Trial Status
- **Enterprise URL:** [https://incantocore.ghe.com/enterprises/incantocore](https://incantocore.ghe.com/enterprises/incantocore)
- **Status:** The enterprise environment is active and requires Single Sign-On (SSO).

## How to Enable Copilot for this Enterprise (No Top-Up Required)
To use GitHub Copilot's agent features without requiring additional "top-ups" (by staying within your trial credit pool), follow these steps in the GitHub UI:

1. **Enable Copilot at the Enterprise Level:**
   - Navigate to the [Enterprise AI controls](https://incantocore.ghe.com/enterprises/incantocore/settings/copilot).
   - Ensure "GitHub Copilot" is set to **Enabled**.
   - **Important:** Set a usage budget in **Billing** to $0 to ensure you stay within the trial's included credits and avoid unexpected charges.

2. **Enable Agent Capabilities:**
   - In the Enterprise settings, navigate to **AI controls** -> **Agents**.
   - Enable the **Copilot Cloud Agent**. This allows you to interact with the agent directly within GitHub.
   - Communicate this to organizations so they can also enable it for their repositories.

3. **Assign Licenses:**
   - In the Enterprise settings, go to **Billing** -> **Copilot**.
   - Assign licenses to specific users or organizations.

4. **Enable for Organizations:**
   - Ensure the organization owning this repository has Copilot and its agent features enabled in its settings.

## Repository Optimizations
A `.github/copilot-instructions.md` file has been added to provide context-specific instructions to the Copilot Agent, improving the quality of its suggestions for this React/Vite project.
