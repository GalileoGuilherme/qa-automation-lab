# QA Automation Lab

Cypress end-to-end tests for the public Automação QA practice store:

<https://portfolio-omega-six-18.vercel.app/automation>

The test suite covers authentication, registration, product discovery, cart totals, discounts, checkout, exercise progress, feedback, and exercise suggestions. EmailJS calls are intercepted in Cypress so the feedback and suggestion specs never send real email.

## Requirements

- Node.js 18 or newer
- npm
- Google Chrome (optional, for `cy:run:chrome`)

## Setup

```bash
npm install
```

## Run the tests

Open Cypress interactively:

```bash
npm run cy:open
```

Run all specs headlessly:

```bash
npm run cy:run
```

Run headlessly in Chrome:

```bash
npm run cy:run:chrome
```

Override the target site when needed:

```powershell
$env:CYPRESS_BASE_URL = "https://portfolio-omega-six-18.vercel.app"
npm run cy:run
```

The specs use stable element IDs from the practice page. Test accounts and checkout information are fictitious and are held only in the demo application's memory.
