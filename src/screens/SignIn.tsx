import {
    VStack,
    Image,
    Text,
    Center,
    Heading,
    ScrollView,
    Toast,
    useToast,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigatorRouteProps } from "@routes/auth.routes";
import BackgroundImg from "@assets/background.png";
import LogoSVG from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@hooks/useAuth";
import { AppError } from "@utils/AppError";
import { useState } from "react";

type FormData = {
    email: string;
    password: string;
};

export function SignIn() {
    const { SignIn } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const navigation = useNavigation<AuthNavigatorRouteProps>();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>();
    function handleNewAccount() {
        navigation.navigate("signUp");
    }

    async function handleSignIn({ email, password }: FormData) {
        try {
            setIsLoading(true);
            await SignIn(email, password);
        } catch (err) {
            const isAppError = err instanceof AppError;
            const title = isAppError
                ? err.message
                : "Não foi possivél entrar. Tente novamente mais tarde.";
            toast.show({
                title,
                placement: "top",
                bgColor: "red.500",
            });
            setIsLoading(false);
        }
    }
    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
        >
            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImg}
                    defaultSource={BackgroundImg}
                    alt="Pessoas Treinando"
                    resizeMode="contain"
                    position="absolute"
                />
                <Center my={24}>
                    <LogoSVG />
                    <Text color="gray.100" fontSize="sm">
                        Treine sua mente e seu corpo
                    </Text>
                </Center>
                <Center>
                    <Heading
                        color="gray.100"
                        fontSize="xl"
                        mb="6"
                        fontFamily="heading"
                    >
                        Acesse sua conta
                    </Heading>

                    <Controller
                        control={control}
                        name="email"
                        rules={{ required: "E-mail é obrigatório" }}
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        rules={{ required: "Informe a senha" }}
                        render={({ field: { onChange } }) => (
                            <Input
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Button
                        title="Acessar"
                        onPress={handleSubmit(handleSignIn)}
                        isLoading={isLoading}
                    />
                </Center>

                <Center mt={24}>
                    <Text
                        color="gray.100"
                        fontSize="sm"
                        mb={3}
                        fontFamily="heading"
                    >
                        Ainda não tem acesso?
                    </Text>

                    <Button
                        title="Criar Conta"
                        variant="outline"
                        onPress={handleNewAccount}
                    />
                </Center>
            </VStack>
        </ScrollView>
    );
}
