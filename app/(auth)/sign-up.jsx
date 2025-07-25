import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import { authStyles } from '../../assets/styles/auth.styles';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import VerifyEmail from './verify-email';

const SignUpScreen = () => {
    const router = useRouter();
    const { isLoaded, signUp } = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pendingVerification, setpendingVerification] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password) return Alert.alert("error", "please fill in all fields");
        if (password.length < 6) return Alert.alert("error", "password must be atleast 6 characters");
        if (!isLoaded) return;

        setLoading(true)
        try {
            await signUp.create({ emailAddress: email, password })
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
            setpendingVerification(true)
        } catch (err) {
            Alert.alert("error", err.errors?.[0]?.message || "failed to create account");
            console.log(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false)
        }
    }
    if (pendingVerification) return <VerifyEmail email={email} onBack={()=>{
        pendingVerification(false)
    }}/>

    return (
        <View style={authStyles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
                style={authStyles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={authStyles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={authStyles.imageContainer}>
                        <Image
                            source={require("../../assets/images/i2.png")}
                            style={authStyles.image}
                            contentFit="contain"
                        /></View>
                    <Text style={authStyles.title}>Create Account</Text>
                    <View style={authStyles.formContainer}>
                        <View style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter Email'
                                placeholderTextColor={COLORS.textLight}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />

                        </View>


                        <View
                            style={authStyles.inputContainer}>
                            <TextInput
                                style={authStyles.textInput}
                                placeholder='Enter password'
                                placeholderTextColor={COLORS.textLight}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize='none'
                            />
                            <TouchableOpacity
                                style={authStyles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color={COLORS.textLight}
                                />
                            </TouchableOpacity>

                        </View>

                        <TouchableOpacity
                            style={[authStyles.authButton, loading && authStyles.
                                buttonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            <Text style={authStyles.buttonText}>{loading ? "creating account..." : "sign up"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={authStyles.linkContainer}
                            onPress={() => router.push("/(auth)/sign-in")}
                        >
                            <Text style={authStyles.linkText}>
                                Allready have an account ?<Text style={authStyles.link}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

export default SignUpScreen