import { cookies} from "next/headers";
import {NextResponse} from "next/server";

export function POST(){

    const cookieStore = cookies();
    const cookieName = process.env.COOKIE_REFRESH_TOKEN_NAME || 'refresh';
    const credential = cookieStore.get(cookieName);

    if (!credential) {
        return NextResponse.json({
            message: "Token not found",
        },{
            status: 400,
        })
    }

    const refreshToken = credential.value

    if (credential) {
        cookieStore.delete(refreshToken)
        return NextResponse.json({
            message: "Logout successfully",
        }, {
            status:200,
        })
    }

    return NextResponse.json({
        message: "Failed to logout",
    },{
        status:400
    });

}