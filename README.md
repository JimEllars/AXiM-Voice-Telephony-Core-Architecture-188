# AXiM Voice Telephony Core

## Architecture Overview
This repository contains the AXiM Voice Telephony Core, a software-defined telephony mesh operator cockpit.
It utilizes:
- **Twilio Programmable Voice** for core audio transport and dialing.
- **Cloudflare Workers** for sub-10ms TwiML routing, telemetry, and security.
- **React/Vite Pages** for this operator cockpit, providing live monitoring, real-time WebSocket transcriptions, and voicemail triage tools.

## Required Environment Variables
For local development and successful deployments, the following environment variables must be defined in your `.env` or CI/CD platform:
- `VITE_CORE_API_URL`
- `VITE_TELEPHONY_WORKER_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Local Development & Build Commands

To set up and run the project locally:

1. Install dependencies:
   `npm install`

2. Start the local development server:
   `npm run dev`

3. Build for production:
   `npm run build`

## Telemetry & Health Endpoints
- The application uplinks telemetry and monitoring events to the central Core API.
- Edge Worker status is constantly monitored via WebSocket connections and REST fallbacks.
- Database persistence (Supabase) is leveraged for configuration and operator telemetry.
