import type { PropsWithChildren } from "react";

export const ReactWrapper = ({ children }: PropsWithChildren) => {
    return <div>
        React Wrapper
        {children}
    </div>
}