export const roadmapInclude = {
  phases: {
    orderBy: { order: "asc" as const },
    include: {
      topics: {
        orderBy: { order: "asc" as const },
        include: {
          projects: true,
          resources: true,
          progress: true,
        },
      },
    },
  },
  topProjects: true,
};
