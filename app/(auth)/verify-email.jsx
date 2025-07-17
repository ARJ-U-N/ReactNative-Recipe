import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSignUp } from '@clerk/clerk-expo'
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles';
import { COLORS } from '../../constants/colors';
import { Image } from 'expo-image';

const VerifyEmail = ({ email, onBack }) => {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [code, setCode] = useState("")
    const [loading, setLoading] = useState(false)
    const handleVerification = async () => {
        if (!isLoaded) return;
        setLoading(true)
        try {
            const signUpAttempt = await signUp.attemptEmailAddressVerification({ code })
            if (signUpAttempt.status === "complete") {
                await setActive({ session: signUpAttempt.createdSessionId })
            }
            else {
                Alert.alert("error", "verification failed");
                console.log(JSON.stringify(signUpAttempt, null, 2));
            }
        } catch (err) {
            Alert.alert("error", err.errors?.[0]?.message || "verification failed")
            console.log(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                style={authStyles.keyboardView}>
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}

                >
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i3.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        /></View>
                    <Text style={authStyles.title}>Verify your Email</Text>
                    <Text style={authStyles.subtitle}>We&apos;ve sent a verification code to {email}</Text>
                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter verification code'
                                placeholderTextColor={COLORS.textLight}
                                value={code}
                                onChangeText={setCode}
                                keyboardType='number-pad'
                                autoCapitalize='none'
                            />

                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.
                                buttonDisabled]}
                            onPress={handleVerification}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "Verifying..." : "Verify Email"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
                            <Text style={authStyles.linkText}>
                                <Text style={authStyles.link}>back to sign up</Text>
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default VerifyEmail