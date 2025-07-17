import { View, Text, Alert, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSignIn } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { authStyles } from '../../assets/styles/auth.styles';
import { useState } from 'react';
import {Image} from "expo-image"
import { COLORS } from '../../constants/colors';
import {Ionicons} from "@expo/vector-icons"


const SignInScreen = () => {
    const router= useRouter();

    const {signIn,SetActive,isLoaded}=useSignIn();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSignIn=async()=>{
        if(!email ||!password){
            Alert.alert("Error","please fill in all fields")
            return
        }
        if(!isLoaded) return;
        setLoading(true)

        try {
            const signInAttempt =await signIn.create({
                identifier:email,
                password
            })

            if(signInAttempt.status ==="complete"){
                await SetActive({session:signInAttempt.createdSessionId})
            }
            else{
                Alert.alert("Error","please try again")
                console.log(JSON.stringify(signInAttempt,null,2));
            }
        } catch (err) {
            Alert.alert("Error",err.errors?.[0]?.message || "sign in failed");
            console.log(JSON.stringify(err,null,2));
        } finally{
            setLoading(false)
        }
    }
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
      style={authStyles.keyboardView}
       behavior={Platform.OS==="ios" ? "padding":"height"}
       keyboardVerticalOffset={Platform.OS=== "ios" ? 64:0}
      >
        <ScrollView
        contentContainerStyle={authStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
            <View style={authStyles.imageContainer}>
                <Image
                source={require("../../assets/images/i1.png")}
                style={authStyles.image}
                contentFit ="contain"
                />
            </View>
            <Text style={authStyles.title}>Welcome Back</Text>
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
            onPress={()=>setShowPassword(!showPassword)}
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
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
                >
                    <Text style={authStyles.buttonText}>{loading ? "signing in...":"sign in"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={()=> router.push("/(auth)/sign-up")}
                >
                    <Text style={authStyles.linkText}>
                        Don&apos;t have an account?<Text style={authStyles.link}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default SignInScreen