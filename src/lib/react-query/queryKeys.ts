export const queryKeys = {
  blog: {
    all: ["blog"] as const,
    posts: () => [...queryKeys.blog.all, "posts"] as const,
  },
  resources: {
    all: ["resources"] as const,
    list: () => [...queryKeys.resources.all, "list"] as const,
  },
} as const;
