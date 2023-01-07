import { useState } from "react";
import { Heading, VStack, SectionList, Text } from "native-base";
import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
export function History() {
    const [exercices, setExercies] = useState([
        {
            title: "20.12.2022",
            data: ["Puxada Frontal", "Remada Lateral"],
        },
    ]);
    return (
        <VStack>
            <ScreenHeader title="History" />
            <SectionList
                sections={exercices}
                keyExtractor={(item) => item}
                renderItem={({ item }) => <HistoryCard />}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={
                    exercices.length === 0 && {
                        flex: 1,
                        justifyContent: "center",
                    }
                }
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <Text color="gray.100" textAlign="center">
                        Não há exercicios registrados ainda. {"\n"}
                        Vamos fazer exercicios hoje?
                    </Text>
                )}
            />
        </VStack>
    );
}
