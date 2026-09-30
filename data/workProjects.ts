export type WorkProject = {
  id: string;
  title: string;
  shortTitle?: string;
};

export const workProjects: WorkProject[] = [
  { id: "3d-web-viewer", title: "3D Web Viewer" },
  { id: "transparent-employer-branding", title: "Transparent employer branding", shortTitle: "Employer branding" },
  { id: "dashboard", title: "Dashboard" },
  { id: "keyless-car-rental", title: "Keyless car rental", shortTitle: "Keyless rental" },
  { id: "finding-your-driver", title: "Find your driver" },
  { id: "colorful-car-leasing", title: "Colorful car leasing", shortTitle: "Car leasing" },
  { id: "blog-redesign", title: "Blog redesign" },
  { id: "motivating-students-to-read", title: "Motivating students to read", shortTitle: "Motivating to read" },
];

export const workProjectIds = workProjects.map((project) => project.id);
