import { Stack } from "@chakra-ui/react";
import { PortalLayout } from "components/app-layouts/portal";
import { GuidesList } from "components/portal/guides-list";
import { PortalHeaderCard } from "components/portal/header-card";
import { useTrack } from "hooks/analytics/useTrack";
import { BreadcrumbJsonLd, NextSeo } from "next-seo";
import { ConsolePage } from "pages/_app";
import React from "react";
import { getAllGuides } from "utils/mdxUtils";
import { GuidesPageProps } from "utils/portalTypes";

const EditionPage: ConsolePage<GuidesPageProps> = ({ guides }) => {
  const { Track } = useTrack({
    page: "guides_edition",
  });
  return (
    <Track>
      <NextSeo
        title="Edition Guides | Portal"
        openGraph={{
          title: "Edition Guides | Portal | thirdweb",
          description:
            "Guides and tutorials on how to create and use an ERC1155 token",
          url: `https://portal.thirdweb.com/guides/edition`,
        }}
      />
      <BreadcrumbJsonLd
        itemListElements={[
          {
            position: 1,
            name: "Portal",
            item: "https://portal.thirdweb.com",
          },
          {
            position: 2,
            name: "Guides",
            item: "https://portal.thirdweb.com/guides",
          },
          {
            position: 3,
            name: "Edition Guides",
            item: `https://portal.thirdweb.com/guides/edition`,
          },
        ]}
      />
      <Stack spacing={20}>
        <PortalHeaderCard
          title="Edition"
          subtitle="ERC1155 standard"
          src="/assets/portal/contract-header.png"
        />
        <GuidesList title="All guides" guides={guides} />
      </Stack>
    </Track>
  );
};

export function getStaticProps() {
  const guides = getAllGuides().filter((guide) =>
    guide.metadata.tags.some((tag: string) => tag === "edition"),
  );

  return {
    props: { guides },
  };
}

export default EditionPage;

EditionPage.Layout = PortalLayout;
