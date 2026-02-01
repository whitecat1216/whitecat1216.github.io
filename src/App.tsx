import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { BlogPost, getPostBySlug, getPosts } from './posts'

type NavItem = {
  id: string
  label: string
  type: 'section' | 'route'
  path?: string
}

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  stargazers_count: number
  language: string | null
  fork: boolean
  archived: boolean
  updated_at: string
}

type LocationState = {
  focusSection?: string
}

const GITHUB_USERNAME = 'whitecat1216'

const navItems: NavItem[] = [
  { id: 'about', label: 'プロフィール', type: 'section' },
  { id: 'skills', label: 'スキル', type: 'section' },
  { id: 'blog', label: 'ブログ', type: 'section' },
  { id: 'github', label: '作品', type: 'section' },
  { id: 'experience', label: '経歴', type: 'section' },
]

const NavBar = ({
  activeId,
  onSectionSelect,
  onRouteSelect,
}: {
  activeId: string
  onSectionSelect: (sectionId: string) => void
  onRouteSelect: (path: string) => void
}) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
    <div className="container">
      <a
        className="navbar-brand"
        href="#home"
        onClick={(event) => {
          event.preventDefault()
          onSectionSelect('about')
        }}
      >
        <strong>MySite</strong>
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navMenu"
        aria-controls="navMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navMenu">
        <ul className="navbar-nav ms-auto">
          {navItems.map((item) => (
            <li className="nav-item" key={item.id}>
              <a
                className={`nav-link${activeId === item.id ? ' active' : ''}`}
                href={item.type === 'section' ? `#${item.id}` : item.path ?? '#'}
                onClick={(event) => {
                  event.preventDefault()
                  if (item.type === 'section') {
                    onSectionSelect(item.id)
                  } else if (item.path) {
                    onRouteSelect(item.path)
                  }
                }}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
)

const Hero = ({ onBlogClick }: { onBlogClick: () => void }) => (
  <section id="home" className="hero">
    <div id="topCarousel" className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1920&h=600&fit=crop"
            className="d-block w-100"
            alt="スライド1"
          />
          <div className="carousel-caption d-flex flex-column justify-content-center h-100">
            <h1 className="fw-bold">ようこそマイサイトへ</h1>
            <p className="lead">技術とライフスタイルの記録</p>
            <button type="button" className="btn btn-primary" onClick={onBlogClick}>
              記事を読む
            </button>
          </div>
        </div>
        <div className="carousel-item">
          <img
            src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1920&h=600&fit=crop"
            className="d-block w-100"
            alt="スライド2"
          />
          <div className="carousel-caption d-flex flex-column justify-content-center h-100">
            <h1 className="fw-bold">最新技術を学ぶ</h1>
            <p className="lead">プログラミングの世界へ</p>
            <button type="button" className="btn btn-primary" onClick={onBlogClick}>
              ブログを見る
            </button>
          </div>
        </div>
      </div>
      <button className="carousel-control-prev" type="button" data-bs-target="#topCarousel" data-bs-slide="prev">
        <span className="carousel-control-prev-icon" />
      </button>
      <button className="carousel-control-next" type="button" data-bs-target="#topCarousel" data-bs-slide="next">
        <span className="carousel-control-next-icon" />
      </button>
    </div>
  </section>
)

const AboutSection = () => (
  <section id="about" className="py-5 bg-light">
    <div className="container">
      <h2 className="section-title">プロフィール</h2>
      <p>ここに自己紹介を記載します。</p>
    </div>
  </section>
)

const SkillsSection = () => (
  <section id="skills" className="py-5">
    <div className="container">
      <h2 className="section-title">スキル</h2>
      <ul className="skill-list">
        <li>HTML / CSS / JavaScript</li>
        <li>Python / Java / .NET</li>
        <li>Docker / DevContainer / CI/CD</li>
      </ul>
    </div>
  </section>
)

const BlogPreview = ({ posts, onScrollToBlog }: { posts: BlogPost[]; onScrollToBlog: () => void }) => (
  <section id="blog-preview" className="py-5 bg-light">
    <div className="container">
      <h2 className="section-title">ブログ</h2>
      <div className="row g-4">
        {posts.map((post) => (
          <div className="col-12 col-lg-6" key={post.slug}>
            <article className="card h-100 shadow-sm border-0">
              <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
                  <h3 className="h5 mb-0">{post.title}</h3>
                  <span className="badge bg-primary-subtle text-primary-emphasis">
                    {post.date ? new Date(post.date).toLocaleDateString('ja-JP') : '日付未設定'}
                  </span>
                </div>
                {post.tags.length > 0 && (
                  <div className="mb-2 d-flex flex-wrap gap-2 small text-muted">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge bg-secondary-subtle text-secondary-emphasis">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-secondary flex-grow-1">{post.summary}</p>
                <div className="d-flex gap-2 mt-auto">
                  <Link to={`/blog/${post.slug}`} className="btn btn-outline-primary btn-sm">
                    記事を開く
                  </Link>
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onScrollToBlog}>
                    一覧を見る
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const ExperienceSection = () => (
  <section id="experience" className="py-5 bg-light">
    <div className="container">
      <h2 className="section-title">経歴</h2>
      <p>ここに経歴を記載します。</p>
    </div>
  </section>
)

const formatLanguage = (language: string | null) => language ?? '言語情報未設定'

const GitHubShowcase = ({ username }: { username: string }) => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const controller = new AbortController()

    const fetchRepos = async () => {
      try {
        setStatus('loading')
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }

        const data = (await response.json()) as GitHubRepo[]

        const primary = data.filter((repo) => !repo.fork && !repo.archived)
        const fallback = data.filter((repo) => !repo.archived)

        const ranked = (primary.length > 0 ? primary : fallback).sort((a, b) => {
          if (b.stargazers_count !== a.stargazers_count) {
            return b.stargazers_count - a.stargazers_count
          }
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        })

        setRepos(ranked)
        setStatus('success')
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return
        }
        setStatus('error')
      }
    }

    fetchRepos()

    return () => controller.abort()
  }, [username])

  const topRepos = useMemo(() => repos.slice(0, 6), [repos])

  return (
    <section id="github" className="py-5">
      <div className="container">
        <h2 className="section-title">作品</h2>
        {status === 'loading' && <p>しばらくお待ちください。リポジトリを取得中です。</p>}
        {status === 'error' && (
          <p className="text-danger">GitHubリポジトリを取得できませんでした。時間を置いて再度お試しください。</p>
        )}
        {status === 'success' && topRepos.length === 0 && <p>公開中の作品が見つかりませんでした。</p>}
        {status === 'success' && topRepos.length > 0 && (
          <div className="row g-4">
            {topRepos.map((repo) => (
              <div className="col-12 col-md-6 col-lg-4" key={repo.id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body d-flex flex-column">
                    <h3 className="h5 mb-2">{repo.name}</h3>
                    <p className="text-secondary flex-grow-1">
                      {repo.description ?? '説明が登録されていません。'}
                    </p>
                    <div className="d-flex flex-wrap gap-2 mb-3 small text-muted">
                      <span>
                        <i className="bi bi-star-fill me-1 text-warning" />
                        {repo.stargazers_count}
                      </span>
                      <span>
                        <i className="bi bi-git me-1" />
                        {formatLanguage(repo.language)}
                      </span>
                      <span>
                        <i className="bi bi-clock-history me-1" />
                        {new Date(repo.updated_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div className="mt-auto d-flex gap-2">
                      <a
                        href={repo.html_url}
                        className="btn btn-outline-primary btn-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHubで見る
                      </a>
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          className="btn btn-outline-secondary btn-sm"
                          target="_blank"
                          rel="noreferrer"
                        >
                          サイトを見る
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

const Footer = () => {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="py-4 bg-white border-top text-center">
      <p className="mb-0 text-secondary">© {currentYear} MySite</p>
    </footer>
  )
}

const HomePage = ({ posts, onScrollToBlog }: { posts: BlogPost[]; onScrollToBlog: () => void }) => {
  const latestPosts = posts.slice(0, 2)

  return (
    <>
      <Hero onBlogClick={onScrollToBlog} />
      <AboutSection />
      <SkillsSection />
      {latestPosts.length > 0 && <BlogPreview posts={latestPosts} onScrollToBlog={onScrollToBlog} />}
      <GitHubShowcase username={GITHUB_USERNAME} />
      <ExperienceSection />
    </>
  )
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const post = useMemo(() => (slug ? getPostBySlug(slug) : undefined), [slug])

  if (!slug || !post) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="alert alert-warning" role="alert">
            記事が見つかりませんでした。
          </div>
          <Link to="/" state={{ focusSection: 'blog' }} className="btn btn-outline-primary btn-sm">
            ブログ一覧に戻る
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="mb-3">
          <Link to="/" state={{ focusSection: 'blog' }} className="btn btn-outline-secondary btn-sm">
            一覧へ戻る
          </Link>
        </div>
        <article className="bg-white shadow-sm border rounded-3 p-4">
          <header className="mb-4">
            <h1 className="h3 mb-2">{post.title}</h1>
            <div className="text-muted small d-flex flex-wrap gap-3">
              <span>
                <i className="bi bi-calendar-event me-1" />
                {post.date ? new Date(post.date).toLocaleDateString('ja-JP') : '日付未設定'}
              </span>
              {post.tags.length > 0 && (
                <span>
                  <i className="bi bi-tags me-1" />
                  {post.tags.map((tag) => `#${tag}`).join(' ')}
                </span>
              )}
            </div>
          </header>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </div>
    </section>
  )
}

const App = () => {
  const posts = useMemo(() => getPosts(), [])
  const location = useLocation()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState<string>(navItems[0]?.id ?? '')
  const locationState = (location.state as LocationState | null) ?? null

  useEffect(() => {
    if (!locationState?.focusSection) {
      return
    }

    const timer = window.setTimeout(() => scrollToSection(locationState.focusSection), 120)
    navigate(location.pathname, { replace: true, state: null })

    return () => window.clearTimeout(timer)
  }, [locationState, location.pathname, navigate])

  useEffect(() => {
    if (location.pathname.startsWith('/blog')) {
      setActiveId('blog')
      window.scrollTo({ top: 0 })
      return
    }

    const sectionIds = ['about', 'skills', 'blog-preview', 'github', 'experience']

    const handleScroll = () => {
      let current: string = 'about'
      for (const id of sectionIds) {
        const element = document.getElementById(id)
        if (!element) continue
        const offsetTop = element.offsetTop - 128
        if (window.scrollY >= offsetTop) {
          current = id === 'blog-preview' ? 'blog' : id
        }
      }
      setActiveId(current)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId === 'blog' ? 'blog-preview' : sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 96
      window.scrollTo({ top: offsetTop, behavior: 'smooth' })
    }
  }

  const handleSectionSelect = (sectionId: string) => {
    const activeSection = sectionId === 'blog' ? 'blog' : sectionId
    setActiveId(activeSection)

    if (location.pathname !== '/') {
      navigate('/', { state: { focusSection: sectionId } })
      return
    }

    scrollToSection(sectionId)
  }

  const handleRouteSelect = (path: string) => {
    setActiveId('blog')
    navigate(path)
  }

  return (
    <>
      <NavBar activeId={activeId} onSectionSelect={handleSectionSelect} onRouteSelect={handleRouteSelect} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage posts={posts} onScrollToBlog={() => handleSectionSelect('blog')} />} />
          <Route path="/blog" element={<Navigate to="/" replace state={{ focusSection: 'blog' }} />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
