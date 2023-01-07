import { useState } from "react";
import { ScreenHeader } from "@components/ScreenHeader";

import { UserPhoto } from "@components/UserPhoto";
import { Input } from "@components/Input";
import {
    Center,
    ScrollView,
    Text,
    VStack,
    Skeleton,
    Heading,
    useToast,
} from "native-base";
import { Alert, TouchableOpacity } from "react-native";
import { Button } from "@components/Button";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

const PHOTO_SIZE = 33;

export function Profile() {
    const toast = useToast();
    const [photoIsLoading, setPhotoIsLoading] = useState(false);
    const [userPhoto, setUserPhoto] = useState(
        "https://github.com/caioalmeidadev.png"
    );
    async function handleUserPhotoSelect() {
        setPhotoIsLoading(true);
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
                base64: true,
            });

            if (photoSelected.canceled) return;
            if (photoSelected.assets[0].uri) {
                const photoInfo = await FileSystem.getInfoAsync(
                    photoSelected.assets[0].uri
                );
                if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
                    return toast.show({
                        title: "Esta imagem é muito grande. Escolha uma de até 5MB.",
                        placement: "top",
                        bgColor: "red.500",
                    });
                }

                setUserPhoto(photoSelected.assets[0].uri);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setPhotoIsLoading(false);
        }
    }
    return (
        <VStack flex={1}>
            <ScreenHeader title="Profile" />
            <ScrollView _contentContainerStyle={{ paddingBottom: 12 }}>
                <Center mt={6} px={10}>
                    {photoIsLoading ? (
                        <Skeleton
                            w={PHOTO_SIZE}
                            h={PHOTO_SIZE}
                            rounded="full"
                            startColor="gray.500"
                            endColor="gray.400"
                        />
                    ) : (
                        <UserPhoto
                            source={{
                                uri: userPhoto,
                            }}
                            alt="Foto do usuário"
                            size={PHOTO_SIZE}
                        />
                    )}
                    <TouchableOpacity onPress={handleUserPhotoSelect}>
                        <Text
                            color="green.500"
                            fontWeight="bold"
                            fontSize="md"
                            mt={2}
                            mb={8}
                        >
                            Alterar Foto
                        </Text>
                    </TouchableOpacity>

                    <Input placeholder="Nome" bg="gray.600" />
                    <Input placeholder="E-mail" bg="gray.600" isDisabled />

                    <Heading
                        color="gray.200"
                        fontSize="md"
                        mb={2}
                        mt={12}
                        alignSelf="flex-start"
                        fontFamily="heading"
                    >
                        Alterar Senha
                    </Heading>
                    <Input
                        bg="gray.600"
                        placeholder="Senha antiga"
                        secureTextEntry
                    />
                    <Input
                        bg="gray.600"
                        placeholder="Nova Senha"
                        secureTextEntry
                    />
                    <Input
                        bg="gray.600"
                        placeholder="Comfirmação de Senha"
                        secureTextEntry
                    />

                    <Button title="Atualizar" mt={4} />
                </Center>
            </ScrollView>
        </VStack>
    );
}
