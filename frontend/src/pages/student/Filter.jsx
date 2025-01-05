import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categories } from "../../utils/categories";

const Filter = ({ handleFilterChange }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState("");

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) => {
            const updatedCategories = prevCategories.includes(categoryId)
                ? prevCategories.filter((id) => id !== categoryId)
                : [...prevCategories, categoryId];

            handleFilterChange(updatedCategories, sortByPrice);
            return updatedCategories;
        });
    };

    const handleSortChange = (value) => {
        setSortByPrice(value);
        handleFilterChange(selectedCategories, value);
    };

    return (
        <div className="w-full md:w-[20%]">
            <div className="flex items-center justify-between">
                <h1 className="font-semibold text-lg md:text-xl">Filter Options</h1>
                <Select onValueChange={handleSortChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by Price</SelectLabel>
                            <SelectItem value="low">Low to High</SelectItem>
                            <SelectItem value="high">High to Low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" />
            <div>
                <h1 className="font-semibold mb-2">CATEGORY</h1>
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2 my-2">
                        <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)} // Controlled
                            onCheckedChange={() => handleCategoryChange(category.id)}
                        />
                        <Label htmlFor={category.id} className="text-sm font-medium">
                            {category.label}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Filter;
