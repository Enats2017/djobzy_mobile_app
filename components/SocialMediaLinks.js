// SocialMediaLinks.js
import React from "react";
import { View } from "react-native";
import SocialButton from "./SocialButton";

const SocialMediaLinks = ({ socialLinks = [] }) => {
    if (!socialLinks?.length) return null;

    const socialPlatformsConfig = {
        facebook: { icon: "facebook", type: "fa", color: "#1877F2" },
        linkedin: { icon: "linkedin", type: "fa", color: "#0077B5" },
        instagram: { icon: "instagram", type: "fa", color: "#E4405F" },
        youtube: { icon: "youtube-play", type: "fa", color: "#FF0000" },
        x: { icon: "x-twitter", type: "fa6", color: "#000000" },
        tiktok: { icon: "tiktok", type: "fa6", color: "#000000" },
        telegram: { icon: "telegram", type: "fa", color: "#0088cc" },
        snapchat: { icon: "snapchat", type: "fa", color: "#FFFC00" },
        pinterest: { icon: "pinterest", type: "fa", color: "#E60023" },
        vk: { icon: "vk", type: "fa", color: "#4C75A3" },
        global: { icon: "globe", type: "fa", color: "#555" },
    };
    return (
        <View
            style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 10,
            }}
        >
            {socialLinks.map((item, index) => {
                const platform = socialPlatformsConfig[item.social_type];
                if (!platform) return null;

                return (
                    <SocialButton
                        key={index}
                        icon={platform.icon}
                        type={platform.type}
                        color={platform.color}
                        url={item.social_link}
                    />
                );
            })}
        </View>
    );
};

export default SocialMediaLinks;