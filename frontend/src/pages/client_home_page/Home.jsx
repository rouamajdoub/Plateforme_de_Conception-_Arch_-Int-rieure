import React from "react";
import { Checkbox } from "../../components/ui/checkbox";
import { Slider } from "../../components/ui/slider";
import  Header  from "./Global/Header";
import { NavigationSection } from "./Global/NavigationSection";
import { Projects } from "./section/Projects";

export const Home = () => {
  // Category data for mapping
  const categories = [
    { id: "category1", label: "category 1", checked: true },
    { id: "category2", label: "category 2", checked: false },
    { id: "category3", label: "category 3", checked: false },
    { id: "category4", label: "category 4", checked: false },
  ];

  // Tags data for mapping
  const tags = [
    { id: "tag1", label: "tag 1", checked: false },
    { id: "tag2", label: "tag 2", checked: true },
    { id: "tag3", label: "tag 3", checked: false },
    { id: "tag4", label: "tag 4", checked: false },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] relative">
        {/* Header and Navigation sections */}
        <Header />
        <NavigationSection />

        {/* Main content area */}
        <div className="flex w-full mt-[257px]">
          {/* Sidebar */}
          <div className="w-[328px] bg-[#f1f3ff] p-4">
            <h2 className="font-bold text-2xl text-[#010821] mb-8">
              Recent projects
            </h2>

            {/* Category section */}
            <div className="mb-8">
              <h3 className="font-bold text-xl text-[#010821] mb-4 ml-6">
                Category
              </h3>
              <div className="space-y-2 ml-12">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-4"
                  >
                    <Checkbox
                      id={category.id}
                      defaultChecked={category.checked}
                      className={
                        category.checked ? "bg-m-3syslightprimary" : ""
                      }
                    />
                    <label
                      htmlFor={category.id}
                      className="font-semibold text-xl text-[#010821]"
                    >
                      {category.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags section */}
            <div className="mb-8">
              <h3 className="font-bold text-xl text-[#010821] mb-4 ml-6">
                Tags
              </h3>
              <div className="space-y-2 ml-12">
                {tags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-4">
                    <Checkbox
                      id={tag.id}
                      defaultChecked={tag.checked}
                      className={tag.checked ? "bg-m-3syslightprimary" : ""}
                    />
                    <label
                      htmlFor={tag.id}
                      className="font-semibold text-xl text-[#010821]"
                    >
                      {tag.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Range section */}
            <div>
              <h3 className="font-bold text-xl text-[#010821] mb-4 ml-6">
                Budget Range
              </h3>

              {/* Min slider */}
              <div className="mb-4 mx-6">
                <div className="flex justify-between mb-1">
                  <span className="font-light text-[#a1a1a1] text-base">
                    min
                  </span>
                  <span className="font-light text-[#a1a1a1] text-base">
                    10k
                  </span>
                </div>
                <Slider
                  defaultValue={[57]}
                  max={100}
                  step={1}
                  className="h-[13px] bg-white rounded-[30px]"
                />
              </div>

              {/* Max slider */}
              <div className="mx-6">
                <div className="flex justify-between mb-1">
                  <span className="font-light text-[#a1a1a1] text-base">
                    max
                  </span>
                  <span className="font-light text-[#a1a1a1] text-base">
                    15k
                  </span>
                </div>
                <Slider
                  defaultValue={[80]}
                  max={100}
                  step={1}
                  className="h-[13px] bg-white rounded-[30px]"
                />
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 bg-[#f9faff]">
            <Projects />
          </div>
        </div>
      </div>
    </div>
  );
};