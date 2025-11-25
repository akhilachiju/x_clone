"use client";

interface ProfileContentProps {
  activeTab: string;
  displayUsername: string;
}

export default function ProfileContent({ activeTab, displayUsername }: ProfileContentProps) {
  const getTabContent = () => {
    switch (activeTab) {
      case "Posts":
        return {
          title: "No posts yet",
          subtitle: `When @${displayUsername} posts, they'll show up here.`
        };
      case "Replies":
        return {
          title: "No replies yet",
          subtitle: `When @${displayUsername} replies to posts, they'll show up here.`
        };
      case "Highlights":
        return {
          title: "Highlight on your profile",
          subtitle: "You must be subscribed to Premium to highlight posts on your profile."
        };
      case "Articles":
        return {
          title: "Write Articles on X",
          subtitle: "You must be subscribed to Premium+ to write Articles on X"
        };
      case "Media":
        return {
          title: "Lights, camera … attachments!",
          subtitle: "When you post photos or videos, they will show up here."
        };
      case "Likes":
        return {
          title: "You don’t have any likes yet",
          subtitle: "Tap the heart on any post to show it some love. When you do, it’ll show up here."
        };
      default:
        return {
          title: "No content yet",
          subtitle: "Content will appear here."
        };
    }
  };

  const content = getTabContent();

  return (
    <div className="p-4">
      <div className="text-center py-8">
        <p className="text-neutral-400 text-lg">{content.title}</p>
        <p className="text-neutral-500 text-sm mt-2">{content.subtitle}</p>
      </div>
    </div>
  );
}
