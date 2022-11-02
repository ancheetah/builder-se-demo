import {
    builder,
    BuilderComponent,
    BuilderContent,
    useIsPreviewing,
    Image,
  } from '@builder.io/react'
  import Head from 'next/head'
  import DefaultErrorPage from 'next/error'
  import React from 'react'
  import { Themed } from 'theme-ui'
  
  function BlogArticle({ article }) {
    const isPreviewing = useIsPreviewing()
    if (!article && !isPreviewing) {
      return (
        <>
          <Head>
            <meta name="robots" content="noindex" />
          </Head>
          <DefaultErrorPage statusCode={404} />
        </>
      )
    }
  
    return (
      <BuilderContent
        content={article}
        options={{ includeRefs: true, cachebust: true }}
        model="blog-article"
      >
        {(data, loading, fullContent) => (
            <React.Fragment>
              <Head>
                {/* Render meta tags from custom field */}
                <title>{data?.title}</title>
                <meta name="description" content={data?.blurb} />
                <meta name="og:image" content={data?.image} />
              </Head>
  
              <Themed.div
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Themed.h2 sx={{ color: 'primary', textAlign: 'center' }}>
                  {data?.title}
                </Themed.h2>
                <Themed.div sx={{ position: 'relative', maxHeight: 400 }}>
                  <Image aspectRatio={0.4} image={data?.image} />
                </Themed.div>
                <Themed.h6 sx={{ color: 'secondary', textAlign: 'center' }}>
                  By {data?.author.value.name}
                </Themed.h6>
              </Themed.div>
              {/* Render the Builder drag/drop'd content */}
              <BuilderComponent
                name="blog-article"
                content={fullContent}
                options={{ includeRefs: true, cachebust: true }}
              />
            </React.Fragment>
          )
        }
      </BuilderContent>
    )
  }
  
  export async function getStaticProps({ params }) {
    const article =
      (await builder
        .get('blog-article', {
          // Include references, like our `author` ref
          options: { includeRefs: true, cachebust: true },
          query: {
            // Get the specific article by handle
            'data.handle': params.handle,
          },
        })
        .promise()) || null
  
    return {
      props: {
        article,
      },
    }
  }
  
  export async function getStaticPaths() {
    const allPosts = await builder.getAll('blog-article', {
      options: { noTargeting: true },
    });
    return {
      paths: allPosts?.map(post => `/blog/${post.data.handle}`) || [],
      fallback: true,
    };
  }
  
  export default BlogArticle
  