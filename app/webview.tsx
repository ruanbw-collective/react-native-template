import { WebView } from 'react-native-webview';
import { StyleSheet, TouchableOpacity, View, Clipboard, Alert, Platform } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import React, { useState, useRef, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

export type WebViewContainerProps = {
    uri: string
};

type WebViewProps = {
    type: 'titleChange'
    title: string
}

export default function WebViewContainer() {
    const { uri } = useLocalSearchParams() as WebViewContainerProps;
    const [title, setTitle] = useState<string>('');
    const webViewRef = useRef<WebView>(null);
    const [canGoBack, setCanGoBack] = useState<boolean>(false);
    const [canGoForward, setCanGoForward] = useState<boolean>(false);

    const handleBackPress = useCallback(() => {
        if (webViewRef.current && canGoBack) {
            webViewRef.current.goBack();
        }
    }, [canGoBack]);

    const handleForwardPress = useCallback(() => {
        if (webViewRef.current && canGoForward) {
            webViewRef.current.goForward();
        }
    }, [canGoForward]);

    const injectedJavaScript = `
        (function() {
            const originalTitle = document.title;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'titleChange', title: originalTitle }));

            const observer = new MutationObserver(function(mutations) {
                if (document.title !== originalTitle) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'titleChange', title: document.title }));
                }
            });
            observer.observe(document.querySelector('head > title') || document.head, {
                childList: true,
                subtree: true,
                characterData: true
            });
        })();
        true; // Note: this is required by react-native-webview to ensure the JS executes
    `;

    const nativeEvent = {
        titleChange: function ({ title }: WebViewProps) {
            setTitle(title);
        }
    }

    const handleWebViewMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data) as WebViewProps;
            const eventHandle = nativeEvent[data.type]
            if (eventHandle) {
                eventHandle(data)
            }
        } catch (error) {
            console.error('Error parsing WebView message:', error);
        }
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: title || '加载中...',
                    headerBackTitle: '返回',
                    headerRight: () => (
                        <TouchableOpacity
                            onPress={() => {
                                Alert.alert(
                                    '更多选项',
                                    '',
                                    [
                                        {
                                            text: '复制链接',
                                            onPress: () => {
                                                Clipboard.setString(uri);
                                                Alert.alert('链接已复制', 'WebView链接已成功复制到剪贴板。');
                                            },
                                        },
                                        {
                                            text: '从浏览器打开',
                                            onPress: () => {
                                                Linking.openURL(uri).catch(err => console.error('无法打开链接', err));
                                            },
                                        },
                                        {
                                            text: '取消',
                                            style: 'cancel',
                                        },
                                    ],
                                    { cancelable: true }
                                );
                            }}
                        >
                            <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                        </TouchableOpacity>
                    ),
                }}
            />
            <WebView
                ref={webViewRef}
                style={styles.webview}
                originWhitelist={['*']}
                source={{ uri }}
                onLoad={() => console.log('WebView loaded successfully')}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.warn('WebView error: ', nativeEvent.description);
                }}
                onMessage={handleWebViewMessage}
                onNavigationStateChange={(navState) => {
                    setCanGoBack(navState.canGoBack);
                    setCanGoForward(navState.canGoForward);
                }}
                injectedJavaScript={injectedJavaScript}
            />
            <View style={styles.bottomNavigationContainer}>
                <TouchableOpacity onPress={handleBackPress} disabled={!canGoBack} style={styles.navButton}>
                    <Ionicons name="arrow-back" size={32} color={canGoBack ? 'black' : 'gray'} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleForwardPress} disabled={!canGoForward} style={styles.navButton}>
                    <Ionicons name="arrow-forward" size={32} color={canGoForward ? 'black' : 'gray'} />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    webview: {
        flex: 1,
    },
    bottomNavigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        backgroundColor: '#f8f8f8',
    },
    navButton: {
        paddingHorizontal: 20,
    },
});
