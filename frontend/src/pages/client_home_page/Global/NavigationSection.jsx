import { MapPinIcon, SearchIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

export const NavigationSection = () => {
  // Data for search inputs
  const searchData = {
    title: "Find You Perfect Match",
    projectPlaceholder: "project category or keywords",
    locationPlaceholder: "Enter Location",
    buttonText: "Search",
  };

  return (
    <section className="w-full h-36 bg-[#eaeefe] py-3">
      <div className="container mx-auto px-11">
        <h2 className="font-bold text-xl text-[#010821] mb-3">
          {searchData.title}
        </h2>

        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center bg-white rounded-[30px] h-[71px] p-2.5">
              <div className="flex items-center flex-1 gap-2 pl-3">
                <SearchIcon className="w-7 h-7 text-gray-400" />
                <Input
                  className="border-0 text-xl text-[#b7b8b8] focus-visible:ring-0 placeholder:text-[#b7b8b8]"
                  placeholder={searchData.projectPlaceholder}
                />
              </div>

              <div className="w-px h-12 bg-gray-200 mx-4" />

              <div className="flex items-center flex-1 gap-2">
                <MapPinIcon className="w-[38px] h-8 text-gray-400" />
                <Input
                  className="border-0 text-xl text-[#b7b8b8] focus-visible:ring-0 placeholder:text-[#b7b8b8]"
                  placeholder={searchData.locationPlaceholder}
                />
              </div>

              <Button className="bg-[#7363f4] hover:bg-[#6253e4] text-white font-bold text-[22px] h-[51px] w-[134px] rounded-[30px]">
                {searchData.buttonText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
