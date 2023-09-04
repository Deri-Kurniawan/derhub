import MarkdownRenderer from "@/components/MarkdownRenderer";
import Image from "next/image";
import Link from "next/link";
import {
  GoPeople,
  GoStar,
  GoRepoForked,
  GoLaw,
  GoClock,
  GoBook,
  GoRepo,
  GoProject,
  GoPackage,
} from "react-icons/go";
import formatDistance from "date-fns/formatDistance";
import Head from "next/head";

type GitHubUser = {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string | null;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string | null;
  location: string;
  email: string | null;
  hireable: boolean;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
};

type FileInfo = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
};

type Repository = {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: {
    login: string;
    id: number;
    node_id: string;
    avatar_url: string;
    gravatar_id: string | null;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  has_discussions: boolean;
  forks_count: number;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: {
    key: string;
    name: string;
    spdx_id: string;
    url: string;
    node_id: string;
  } | null;
  allow_forking: boolean;
  is_template: boolean;
  web_commit_signoff_required: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  temp_clone_token: string | null;
  network_count: number;
  subscribers_count: number;
  // get readme markdown
  readme: FileInfo | null;
};

async function getUserByUsername(username: string): Promise<GitHubUser | null> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const userData = await response.json();

    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function getUserRepo(
  username: string,
  reponame: string
): Promise<Repository | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${reponame}`
    );
    const userData = await response.json();

    const getReadmeMarkdown = await fetch(
      `https://api.github.com/repos/${username}/${reponame}/readme`
    );
    const readmeMarkdown = await getReadmeMarkdown.json();

    const encodedContent = readmeMarkdown.content;
    const decodedContent = Buffer.from(encodedContent, "base64").toString(
      "utf-8"
    );

    return {
      ...userData,
      readme: {
        ...readmeMarkdown,
        content: decodedContent,
      },
    };
  } catch (error) {
    console.error("Error fetching user repo data:", error);
    return null;
  }
}

async function getUserRepos(username: string): Promise<Repository[] | null> {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const userData = await response.json();

    return userData;
  } catch (error) {
    console.error("Error fetching user repos data:", error);
    return null;
  }
}

const formatDistanceToNow = (date: string) => {
  const distance = formatDistance(new Date(date), new Date(), {
    addSuffix: true,
  });
  return distance;
};

type Props = {
  params: {
    username: string;
  };
};

const languageColor = (language: string) => {
  switch (language) {
    case "JavaScript":
      return "bg-yellow-500";
    case "TypeScript":
      return "bg-blue-500";
    case "HTML":
      return "bg-red-500";
    case "CSS":
      return "bg-blue-500";
    case "Vue":
      return "bg-green-500";
    case "SCSS":
      return "bg-pink-500";
    case "Shell":
      return "bg-gray-500";
    case "Python":
      return "bg-yellow-500";
    case "C#":
      return "bg-purple-500";
    case "C++":
      return "bg-blue-500";
    case "C":
      return "bg-blue-500";
    case "Java":
      return "bg-red-500";
    case "PHP":
      return "bg-purple-500";
    case "Ruby":
      return "bg-red-500";
    case "Go":
      return "bg-blue-500";
    case "Dart":
      return "bg-blue-500";
    case "Swift":
      return "bg-orange-500";
    case "Kotlin":
      return "bg-orange-500";
    case "Rust":
      return "bg-orange-500";
    case "R":
      return "bg-blue-500";
    case "Scala":
      return "bg-red-500";
    case "Objective-C":
      return "bg-blue-500";
    case "Lua":
      return "bg-blue-500";
    case "Perl":
      return "bg-blue-500";
    case "CoffeeScript":
      return "bg-yellow-500";
    case "PowerShell":
      return "bg-blue-500";
    case "TeX":
      return "bg-blue-500";
    case "Haskell":
      return "bg-purple-500";
    case "Elixir":
      return "bg-purple-500";
    case "Clojure":
      return "bg-blue-500";
    case "Racket":
      return "bg-red-500";
    case "D":
      return "bg-red-500";
    case "Assembly":
      return "bg-gray-500";
    case "Vim script":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const TopbarButton = ({
  icon: Icon,
  active,
  href,
  counts,
  children,
}: {
  icon: React.FC<{ className: string }>;
  active?: boolean;
  href: string;
  counts?: number | string;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={`h-full ${active && "border-b-2 border-[#FD8C73]"} pt-2`}
    >
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="hover:bg-[#D0D7DE]/40 px-2 py-1 rounded-lg text-center">
          <Icon
            className={`inline-block text-[#1f2328] ${
              active && "font-semibold"
            } text-lg`}
          />
          <span
            className={`inline-block text-[#1f2328] ${
              active && "font-semibold"
            } text-sm ml-2`}
          >
            {children}{" "}
            {counts && (
              <span className="bg-[#D0D7DE]/50 p-1 rounded-full text-xs text-[#1f2328] font-normal">
                {counts}
              </span>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
};

const Profile = async ({ params: { username } }: Props) => {
  const user = await getUserByUsername(username);
  const specialRepo = await getUserRepo(username, username);
  const repos = await getUserRepos(username);

  if (!user) {
    return <h1>User not found</h1>;
  }

  return (
    <>
      <Head>
        <title>
          {user.name} ({user.login})
        </title>
      </Head>
      {/* topbar */}
      <div>
        <div className="bg-[#F6F8FA] h-12 flex flex-row items-center px-4 gap-2 border-b-[1px] border-[#656D76]/20">
          <TopbarButton icon={GoBook} href={`/${username}`} active>
            Overview
          </TopbarButton>
          <TopbarButton
            icon={GoRepo}
            href={`/${username}?tab=repositories`}
            counts={user.public_repos}
            active={false}
          >
            Repositories
          </TopbarButton>
          <TopbarButton
            icon={GoProject}
            href={`/${username}?tab=projects`}
            active={false}
          >
            Projects
          </TopbarButton>
          <TopbarButton
            icon={GoPackage}
            href={`/${username}?tab=packages`}
            active={false}
          >
            Packages
          </TopbarButton>
          <TopbarButton
            icon={GoStar}
            href={`/${username}?tab=stars`}
            active={false}
          >
            Stars
          </TopbarButton>
        </div>
      </div>
      {/* end of topbar */}

      <div className="max-w-[1280px] mx-auto px-3 md:px-4 lg:px-7 mt-2">
        {/* sidebar */}
        <div className="flex flex-row gap-6 mt-7">
          <div className="w-[294px]">
            <div className="rounded-full w-[294px] h-[294px] overflow-hidden object-cover border-[2.5px] border-[#656D76]/20">
              <Image
                className="relative w-[294px] h-[294px]"
                src={user.avatar_url}
                alt="avatar"
                width="294"
                height="294"
              />
            </div>
            <div className="py-3">
              <span className="block text-[#1f2328] font-semibold text-2xl">
                {user.name}
              </span>
              <span className="block text-[#656D76] font-light text-[20px]">
                {user.login}
              </span>
            </div>
            <div className="text-base text-[#1f2328] font-normal mb-3">
              {user.bio}
            </div>
            <button className="mb-3 py-[5px] px-4 text-sm w-full outline-none text-[#24292F] bg-[#F3F4F6] hover:bg-gray-200/70 font-medium ring-[1px] ring-[#656D76]/20 rounded-sm">
              Follow
            </button>
            <div className="mb-3">
              <Link
                className="text-[#656D76] text-sm group hover:text-blue-500 group"
                href={`/${user.login}?tab=followers`}
              >
                <GoPeople className="inline-block mr-1 text-[#1f2328] font-bold group-hover:text-blue-500" />{" "}
                <span className="text-[#1f2328] font-bold group-hover:text-blue-500">
                  {user.followers}
                </span>{" "}
                followers
              </Link>
              {" · "}
              <Link
                className="text-[#656D76] text-sm hover:text-blue-500 group"
                href={`/${user.login}?tab=following`}
              >
                <span className="text-[#1f2328] font-bold group-hover:text-blue-500">
                  {user.following}
                </span>{" "}
                following
              </Link>
            </div>
          </div>
          {/* repos */}
          <div className="mb-3 w-full">
            {specialRepo ? (
              <>
                {specialRepo.readme && (
                  <div className="p-6 rounded-md border-[1px] border-[#656D76]/20">
                    <div className="text-mono text-xs mb-3">
                      <Link
                        href={`/${username}/${username}`}
                        className="hover:text-blue-600"
                      >
                        {user.login}
                      </Link>{" "}
                      <span className="inline-block text-[#1f2328]">/</span>{" "}
                      {specialRepo.readme.name}
                    </div>
                    <MarkdownRenderer>
                      {specialRepo.readme.content}
                    </MarkdownRenderer>
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <h2 className="mb-4 text-base font-normal text-[#1f2328]">
                    Popular repositories
                  </h2>
                  {user.public_repos > 0 ? (
                    // cards
                    <div className="grid grid-cols-2 gap-4">
                      {repos &&
                        repos.map((repo: Repository, index) => (
                          <div
                            className="col-span-1 px-2 rounded-md border-[1px] border-[#656D76]/20"
                            key={index}
                          >
                            <div className="flex flex-col justify-start p-4 h-full">
                              <div className="flex-1">
                                <div className="flex flex-row">
                                  <Link
                                    className="text-sm text-[#0969DA] hover:underline flex flex-1"
                                    href={`/${user.login}/${repo.name}`}
                                    title={repo.name}
                                  >
                                    <span>{repo.name}</span>
                                  </Link>
                                  <span className="text-xs text-[#656D76] font-medium px-[7px] py-[1px] rounded-2xl border-[1px] border-[#656D76]/40">
                                    Public
                                  </span>
                                </div>
                                {repo.fork && (
                                  <p className="mt-2 mb-4 text-xs text-[#656D76] font-normal">
                                    Forked from{" "}
                                    <Link
                                      className="hover:text-[#0969DA]"
                                      href={`/${repo.owner.login}/${repo.name}`}
                                    >
                                      {repo.owner.login}/{repo.name}
                                    </Link>
                                  </p>
                                )}
                                <p className="mt-2 mb-4 text-xs text-[#656D76] font-normal">
                                  {repo.description}
                                </p>
                              </div>

                              {/* languages at the bottom of card */}
                              <div className="flex flex-row gap-2 items-end">
                                {repo.language && (
                                  <div className="flex flex-row items-center text-xs text-[#656D76] font-normal">
                                    <span
                                      className={`${languageColor(
                                        repo.language
                                      )} w-3 h-3 rounded-full mr-1`}
                                    ></span>
                                    <span>{repo.language}</span>
                                  </div>
                                )}
                                {repo.stargazers_count > 0 && (
                                  <div className="flex flex-row items-center text-xs text-[#656D76] font-normal">
                                    <GoStar className="mr-1" />
                                    <span>{repo.stargazers_count}</span>
                                  </div>
                                )}
                                {repo.forks_count > 0 && (
                                  <div className="flex flex-row items-center text-xs text-[#656D76] font-normal">
                                    <GoRepoForked className="mr-1" />
                                    <span>{repo.forks_count}</span>
                                  </div>
                                )}
                                {repo.license && (
                                  <div className="flex flex-row items-center text-xs text-[#656D76] font-normal">
                                    <GoLaw className="mr-1" />
                                    <span>{repo.license.name}</span>
                                  </div>
                                )}
                                {repo.updated_at && (
                                  <div className="flex flex-row items-center text-xs text-[#656D76] font-normal">
                                    <GoClock className="mr-1" />
                                    <span>
                                      Updated{" "}
                                      {formatDistanceToNow(repo.updated_at)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="m-auto p-8 mb-6">
                      <h2 className="text-center text-[#1f2328] text-2xl font-semibold">
                        {user.login} doesn&apos;t have any public repositories
                        yet.
                      </h2>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
