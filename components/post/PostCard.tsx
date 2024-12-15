import React, { useState } from "react";
import { Post } from "@/sanity.types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrl";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Typography from "../Text";

const PostCard = React.memo(({ post }: { post: Post }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const t = useTranslations("button");
  const locale = useLocale();
  
  return (
    <Card className="w-full flex flex-col h-full mx-auto">
      <div className="relative w-full h-0 pb-[50%]">
        <Image
          src={
            post.mainImage
              ? imageUrl(post.mainImage).url()
              : "/fallback-image.jpg"
          }
          alt={post.title || "Fallback image"}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105 rounded-t-lg"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <CardHeader>
        <Typography variant="h3" className="font-bold">
          {post.title}
        </Typography>
      </CardHeader>
      <CardContent className="flex-grow">
        <Typography 
          variant="p" 
          className={`text-muted-foreground ${isDescriptionExpanded ? "" : "line-clamp-2"}`}
        >
          {post.description}
        </Typography>

        {post.description && post.description.length > 100 && (
          <div className="flex items-center justify-end">
            {isDescriptionExpanded ? (
              <ChevronUp
                className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary"
                onClick={() => setIsDescriptionExpanded(false)}
              />
            ) : (
              <ChevronDown
                className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-primary"
                onClick={() => setIsDescriptionExpanded(true)}
              />
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <Link
          href={`/${locale}/showdetail/${post?.slug?.current}`}
          className="w-full"
        >
          <Typography 
            variant="span" 
            className="text-primary hover:text-primary/80 block text-center"
            locale={locale}
          >
            {t("more")} 
          </Typography>
        </Link>
      </CardFooter>
    </Card>
  );
});

PostCard.displayName = "PostCard";
export default PostCard;
