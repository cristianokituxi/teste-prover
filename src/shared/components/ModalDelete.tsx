import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  ButtonText,
  Heading,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@gluestack-ui/themed";
import { useEffect, useRef } from "react";

type ModalDeleteProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export function ModalDelete({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  isLoading,
}: ModalDeleteProps) {
  const readyRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      readyRef.current = false;
      const timer = setTimeout(() => { readyRef.current = true; }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (readyRef.current) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading size="md">{title}</Heading>
        </ModalHeader>
        <ModalBody>
          <Text>{message}</Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr="$2" onPress={onCancel} isDisabled={isLoading}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button action="negative" onPress={handleConfirm} isDisabled={isLoading}>
            <Ionicons name="trash-outline" size={16} color="#ffffff" />
            <ButtonText ml="$2">{isLoading ? "Excluindo..." : "Excluir"}</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
