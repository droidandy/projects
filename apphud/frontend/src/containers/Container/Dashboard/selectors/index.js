import { getDashboardPlatform } from "selectors/settings"

export const getDashboardPlatformMultiSelectValue = (state) => {
    const platform = getDashboardPlatform(state);
    if(platform === null) {
        return ['ios', 'android'];
    }
    
    return [platform]
}