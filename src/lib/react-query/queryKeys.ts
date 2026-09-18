export const queryKeys = {
  blog: {
    all: ["blog"] as const,
    posts: () => [...queryKeys.blog.all, "posts"] as const,
  },
} as const;
