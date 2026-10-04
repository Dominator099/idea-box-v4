# Idea Box

Classmates write a sticky note and drag it into a ballot box. Only you can read the notes, at `/admin.html`.

## Deploy on Vercel
1. Put these files at the top level of a GitHub repo and import it at vercel.com/new. Click Deploy.
2. In the project, open **Storage**, add **Upstash Redis** (free plan) and connect it to the project (leave Custom Prefix empty).
3. Open **Deployments**, click the three dots on the latest one and choose **Redeploy**.
4. Open `your-site.vercel.app/admin.html` yourself FIRST and create your passcode. This can only be done once.
5. Share the main link with your class.

Forgot the passcode? In the Upstash database's Data Browser, delete the key `admin:passcode`, then create a new one at /admin.html.
