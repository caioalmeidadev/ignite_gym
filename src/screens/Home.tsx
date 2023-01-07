import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { FlatList, Heading, HStack, Text, VStack } from "native-base";
import { AppNavigatorRoutesProps } from "@routes/app.routes";
import { ExerciseCard } from "@components/ExerciseCard";
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
export function Home() {
    const [groups, setGroups] = useState([
        "costas",
        "ombro",
        "biceps",
        "triceps",
    ]);
    const [exercies, setExercies] = useState([
        "Puxada Frontal",
        "Remada Lateral",
        "Remada Curva",
    ]);
    const [groupSelected, setGroupSelected] = useState("costas");
    const navigation = useNavigation<AppNavigatorRoutesProps>();
    function handleOpenExerciseButton() {
        navigation.navigate("excercise");
    }
    return (
        <VStack flex={1}>
            <HomeHeader />
            <FlatList
                data={groups}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={
                            String(groupSelected).toUpperCase() ===
                            String(item).toUpperCase()
                        }
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                maxH={10}
                minH={10}
            />
            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading
                        color="gray.200"
                        fontSize="md"
                        fontFamily="heading"
                    >
                        Exercicios
                    </Heading>
                    <Text color="gray.200" fontSize="sm">
                        {exercies.length}
                    </Text>
                </HStack>
                <FlatList
                    data={exercies}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <ExerciseCard onPress={handleOpenExerciseButton} />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                />
            </VStack>
        </VStack>
    );
}
