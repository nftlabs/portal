import { useWeb3 } from "@3rdweb/hooks";
import { Flex } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { LinkButton } from "./LinkButton";

interface GeneralCtaProps {
  size?: string;
}

export const GeneralCta: React.FC<GeneralCtaProps> = ({ size = "md" }) => {
  const { address } = useWeb3();
  const { trackEvent } = useTrack();

  return (
    <Flex w="100%" justifyContent="center">
      {address ? (
        <LinkButton
          bgColor="primary.500"
          color="white"
          _hover={{ bgColor: "primary.400" }}
          px={12}
          onClick={() =>
            trackEvent({
              category: "cta-button",
              action: "click",
              label: "go-to-dashboard",
            })
          }
          textAlign="center"
          size={size}
          href="/dashboard"
        >
          Go to dashboard
        </LinkButton>
      ) : (
        <LinkButton
          bgColor="primary.500"
          color="white"
          _hover={{ bgColor: "primary.400" }}
          px={12}
          onClick={() =>
            trackEvent({
              category: "cta-button",
              action: "click",
              label: "start",
            })
          }
          textAlign="center"
          size={size}
          href="https://thirdweb.com/start"
        >
          Get Early Access
        </LinkButton>
      )}
    </Flex>
  );
};