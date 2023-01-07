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
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BackgroundImg from "@assets/background.png";
import LogoSVG from "@assets/logo.svg";
import { Input } from "@components/Input";
import { Button } from "@components/Button";
import { api } from "@services/api";
import { AppError } from "@utils/AppError";
import { useState } from "react";
import { useAuth } from "@hooks/useAuth";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
};

const signUpSchema = Yup.object({
    name: Yup.string().required("Informe o nome"),
    email: Yup.string().required("Informa o email").email("E-mail Invalido"),
    password: Yup.string()
        .required("Informe a senha")
        .min(6, "A Senha deve conter ao menos 6 digitos"),
    password_confirm: Yup.string()
        .required("Confirme a senha")
        .oneOf(
            [Yup.ref("password"), null],
            "A confirmação da senha não confere"
        ),
});
export function SignUp() {
    const [isLoading, setIsLoading] = useState(false);
    const { SignIn } = useAuth();
    const navigation = useNavigation();
    const toast = useToast();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormDataProps>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            password_confirm: "",
        },
        resolver: yupResolver(signUpSchema),
    });
    function handleGoBack() {
        navigation.goBack();
    }

    async function handleSingUp({ name, email, password }: FormDataProps) {
        try {
            setIsLoading(true);
            const result = await api.post("/users", { name, email, password });
            await SignIn(email, password);
        } catch (err) {
            const isAppError = err instanceof AppError;
            const title = isAppError
                ? err.message
                : "Não foi possivél criar uma conta. Tente novamente mais tarde.";
            toast.show({
                title,
                placement: "top",
                bgColor: "red.500",
            });
        } finally {
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
                        Cria sua conta
                    </Heading>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Nome"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="password_confirm"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder="Comfirmação de Senha"
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSingUp)}
                                returnKeyType="send"
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />

                    <Button
                        title="Criar e Acessar"
                        onPress={handleSubmit(handleSingUp)}
                        isLoading={isLoading}
                    />
                </Center>

                <Button
                    title="Voltar para o Login"
                    variant="outline"
                    mt={12}
                    onPress={handleGoBack}
                />
            </VStack>
        </ScrollView>
    );
}
