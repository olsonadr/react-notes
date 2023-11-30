export { };

declare global {
    interface Window {
        env: {
            REACT_APP_AUTH0_DOMAIN: string;
            REACT_APP_AUTH0_CLIENT_ID: string;
            REACT_APP_DEV_PORT: string;
        };
    }
}