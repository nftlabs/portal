import { Container, Divider, Heading, Stack, Text } from "@chakra-ui/layout";
import { PortalLayout } from "components/app-layouts/portal";
import { PORTAL_SIDEBAR_WIDTH } from "components/layout/portal-shell/Sidebar";
import { GuideCta } from "components/portal/guide-cta";
import { GuideToc, GUIDE_TOC_WIDTH } from "components/portal/guide-toc";
import { GuidesList } from "components/portal/guides-list";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import fs from "fs";
import matter from "gray-matter";
import { useTrack } from "hooks/analytics/useTrack";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { GetStaticProps } from "next";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { ArticleJsonLd, BreadcrumbJsonLd, NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ConsolePage } from "pages/_app";
import path from "path";
import {
  getAllGuides,
  getHeadings,
  getMdxSource,
  learnWeb3FilePaths,
  LEARN_WEB3_PATH,
} from "utils/mdxUtils";
import { Doc, GuidesPageProps, TocHeading } from "utils/portalTypes";
import { pxToRem } from "utils/pxFunctions";

dayjs.extend(localizedFormat);

interface LearnWeb3PageProps extends GuidesPageProps {
  source: MDXRemoteSerializeResult;
  frontMatter: Doc;
  headings: TocHeading[];
}

const LearnWeb3Page: ConsolePage<LearnWeb3PageProps> = ({
  source,
  frontMatter,
  headings,
  guides,
}) => {
  const router = useRouter();
  const slug = useSingleQueryParam("slug");
  const { Track } = useTrack({
    page: "learn-web3",
    title: frontMatter.title,
    slug,
  });

  const publishedTime = new Date(frontMatter.date).toISOString();
  const modifiedTime = frontMatter.updated
    ? new Date(frontMatter.updated).toISOString()
    : new Date(frontMatter.date).toISOString();
  const authors = frontMatter?.authorTwitter2
    ? [frontMatter.authorTwitter, frontMatter.authorTwitter2]
    : [frontMatter.authorTwitter];

  return (
    <Track>
      <NextSeo
        title={frontMatter.title}
        description={frontMatter.summary}
        openGraph={{
          title: frontMatter.title,
          description: frontMatter.summary,
          url: `https://portal.thirdweb.com${router.asPath}`,
          type: "article",
          article: {
            publishedTime,
            modifiedTime,
            authors,
          },
        }}
        canonical={
          frontMatter.canonical || `https://portal.thirdweb.com${router.asPath}`
        }
      />
      <ArticleJsonLd
        url={`https://portal.thirdweb.com${router.asPath}`}
        title={frontMatter.title}
        images={["https://portal.thirdweb.com/portal.png"]}
        datePublished={publishedTime}
        dateModified={modifiedTime}
        authorName={authors}
        publisherName="thirdweb"
        publisherLogo="https://portal.thirdweb.com/favicon-32x32.png"
        description={frontMatter.summary}
        keywords={frontMatter.title}
        canonical={
          frontMatter.canonical || `https://portal.thirdweb.com${router.asPath}`
        }
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
            name: "Learn web3",
            item: "https://portal.thirdweb.com/learn-web3",
          },
          {
            position: 3,
            name: frontMatter.title,
            item: `https://portal.thirdweb.com${router.asPath}`,
          },
        ]}
      />
      <Stack direction="row" maxW="100%" position="absolute" left={0} w="100%">
        <Container
          flexGrow={1}
          maxW={{
            base: "100%",
            lg: `min(${pxToRem(
              800,
            )}, calc(100vw - ${PORTAL_SIDEBAR_WIDTH} - ${GUIDE_TOC_WIDTH} - var(--chakra-space-20)))`,
          }}
        >
          <Heading size="display.sm" as="h1">
            {frontMatter.title}
          </Heading>
          <Stack
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify={{ base: "inherit", md: "space-between" }}
            mb={10}
            mt={3}
          >
            {frontMatter.updated ? (
              <Text>
                Last updated:{" "}
                <Text display="inline" size="label.lg">
                  {dayjs(frontMatter.updated).format("LL")}
                </Text>
              </Text>
            ) : (
              <Text>
                Published on:{" "}
                <Text size="label.lg" display="inline">
                  {dayjs(frontMatter.date).format("LL")}
                </Text>
              </Text>
            )}
          </Stack>
          <Heading size="subtitle.md">{frontMatter.summary}</Heading>
          <GuideToc
            frontMatter={frontMatter}
            headings={headings}
            isMobile
            docs
          />
          <MDXRemote {...source} />
          {guides.length > 0 && (
            <>
              <Divider my={12} w="100%" />
              <GuidesList title="Related guides" guides={guides} showMore />
            </>
          )}
          <Divider my={12} w="100%" />
          <GuideCta />
        </Container>
        <GuideToc frontMatter={frontMatter} headings={headings} docs />
      </Stack>
    </Track>
  );
};

export default LearnWeb3Page;

LearnWeb3Page.Layout = PortalLayout;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postFilePath = path.join(LEARN_WEB3_PATH, `${params?.slug}.mdx`);
  const source = fs.readFileSync(postFilePath);

  const { content, data } = matter(source);
  const mdxSource = await getMdxSource(content, data);

  let [slug] = params?.slug as string[];

  slug = slug.split(",")[1];

  const guides = getAllGuides()
    .filter((guide) => guide.metadata.tags.some((tag: string) => tag === slug))
    .slice(0, 3);

  return {
    props: {
      source: mdxSource,
      frontMatter: data,
      headings: getHeadings(content),
      guides,
    },
  };
};

export const getStaticPaths = async () => {
  const paths = learnWeb3FilePaths
    // Remove file extensions for page paths
    .map((pth) => pth.replace(/\.mdx?$/, ""))
    // Map the path into the static paths object required by Next.js
    .map((slug) => ({ params: { slug: slug.split(",") } }));

  return {
    paths,
    fallback: false,
  };
};
