export interface WorkProposal {
  clientName: string;
  jobTitle: string;
  jobDescription: string;
  budget: string;
  duration: string;
  category: string;
  imageUrl: string;
}

export const workProposals: WorkProposal[] = [
  {
      clientName: "John Doe",
      jobTitle: "Website Development",
      jobDescription: "Looking for a web developer to create a responsive and SEO-friendly website for my business.",
      budget: "500-1000",
      duration: "2 weeks",
      category: "Web Development",
      imageUrl: "https://landingi.com/wp-content/uploads/2023/02/healthcare-landing-page-cover.png",
  },
  {
      clientName: "Jane Smith",
      jobTitle: "Mobile App Design",
      jobDescription: "Need a designer to create a modern UI/UX for a mobile application.",
      budget: "1000-2000",
      duration: "1 month",
      category: "Mobile Development",
      imageUrl: "src/assets/images/work3.jpg",
  },
];
