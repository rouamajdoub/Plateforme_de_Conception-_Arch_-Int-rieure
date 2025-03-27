import { ChevronRightIcon, HeartIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter } from "../../../components/ui/card";

export const Projects = () => {
  // Project data that can be mapped over
  const projects = [
    {
      id: 1,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
    {
      id: 2,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
    {
      id: 3,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
    {
      id: 4,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
    {
      id: 5,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
    {
      id: 6,
      title: "Project Title",
      image: "/2-1-5.png",
      architectName: "folan",
      estimateBudget: "1522.000",
    },
  ];

  return (
    <section className="w-full py-7">
      <div className="grid grid-cols-2 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="w-full bg-[#eaeefe] rounded-[20px] border-none"
          >
            <CardContent className="p-0 relative">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 p-0 h-6 w-6"
                  aria-label="Favorite"
                >
                  <HeartIcon className="h-[22px] w-[23px]" />
                </Button>

                <div className="relative">
                  <img
                    className="w-[191px] h-[191px] object-cover rounded-[20px]"
                    alt="Project thumbnail"
                    src={project.image}
                  />
                  <div className="absolute inset-0 rounded-[20px] [background:linear-gradient(180deg,rgba(224,224,224,0.69)_10%,rgba(0,0,0,0.69)_65%)] opacity-70" />
                  <div className="absolute bottom-2 left-0 w-full text-center">
                    <p className="font-normal text-white text-sm leading-[21px]">
                      {project.title}
                    </p>
                  </div>
                </div>

                <div className="absolute top-[59px] right-6 flex flex-col gap-6">
                  <div>
                    <p className="font-semibold text-black text-sm leading-[21px]">
                      Architect Name
                    </p>
                    <p className="font-normal text-[#65558f] text-sm leading-[21px]">
                      {project.architectName}
                    </p>
                  </div>

                  <div>
                    <p className="font-semibold text-black text-sm leading-[21px]">
                      Estimate Budget
                    </p>
                    <p className="font-normal text-[#65558f] text-sm leading-[21px]">
                      {project.estimateBudget}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end p-2">
              <Button
                variant="ghost"
                className="h-6 p-0 font-semibold text-[#65558f] text-[10px] leading-[15px]"
              >
                More Details
                <ChevronRightIcon className="ml-1 h-[22px] w-[23px]" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
};
