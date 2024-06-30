## Getting Started

- Clone the repository

- Copy your [OpenAI API key](https://platform.openai.com/api-keys) from your dashboard and paste it into the `.env.local` file
  ```bash
  OPENAI_API_KEY=<api_key>
  OPENAI_MODEL=gpt-4-1106-preview //OR your preferred model
  ```
- Add your [Twitter Client ID and Client Secret](https://developer.twitter.com/en/portal/dashboard) to the `.env.local` file.
  ```bash
  TWITTER_CLIENT_ID=<client_id>
  NEXT_PUBLIC_TWITTER_CLIENT_ID=<client_id>
  TWITTER_CLIENT_SECRET=<client_secret>
  ```
  
- Run `npm install` to install the project dependencies
  ```bash
  npm install
  ```

- Start the development server by running the code snippet below:
  ```bash
  npm run dev
  ```
