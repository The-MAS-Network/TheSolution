const configs = [
  {
    title: "VITE_CRYPTO_JS_ENCRYPTION_KEY",
    value: import.meta.env.VITE_CRYPTO_JS_ENCRYPTION_KEY,
  },
  {
    title: "VITE_APP_BACKEND_BASE_URL",
    value: import.meta.env.VITE_APP_BACKEND_BASE_URL,
  },
] as const;

export const checkAppConfig = () => {
  for (let i = 0; i < configs.length; i++) {
    if (!configs[i].value) {
      const message = `⚠️  Sorry. Could not find the value of ${configs[i].title} in .env ⚠️`
      console.log(
       message
      );
      window.alert(message)
    }
  }
};

checkAppConfig();

export default Object.freeze({
  [configs?.[0].title]: configs?.[0]?.value,
  [configs?.[1].title]: configs?.[1]?.value,
});
