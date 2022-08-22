import { useSession, signIn, signOut  } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return <>
      Signed is as {session.user.email} <br />
      <img src={session.user.image} alt="" />
      <button onClick={() => signOut()}>Cerrar sesion</button>
    </>
  }
  return <>
    No ha iniciado sesión <br />
    <button onClick={() => signIn()}>Inicia sesion</button>
  </>
}