
# mesh.nav Admin Panel

This provides a basic admin panel to implement and 
manage mesh.nav locally

## Installation

```bash
npm install
```

## Running the server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the admin panel.

By default the admin panel is connected to our hosted backend at https://meshnav.azurewebsites.net. To
connect it with your own backend, run the backend branch with the instructions provided and change the
apiDomain string in `apiConfig.js` to `http://localhost:8000`.

## Access Remote Instance

You can access the deployed instance of this admin panel on https://meshnav-admin.vercel.app.


