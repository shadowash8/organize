// app.config.ts
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
    const isDev = process.env.APP_VARIANT === 'dev';

    return {
        ...config,
        name: isDev ? 'Organize (Dev)' : 'Organize',
        android: {
            ...config.android,
            package: isDev ? 'com.shadowash8.organize.dev' : 'com.shadowash8.organize',
            adaptiveIcon: {
                foregroundImage: './assets/images/android-icon-foreground.png',
                monochromeImage: './assets/images/android-icon-monochrome.png',
                backgroundColor: isDev ? '#000000' : '#ffffff',
            },
        },
    };
};
