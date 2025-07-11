import { View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedSafeAreaViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedSafeAreaViewProps) {
    const insets = useSafeAreaInsets();
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return <View style={[{ backgroundColor }, style, { paddingTop: insets.top }]} {...otherProps} />;
}
