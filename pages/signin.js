import { getCsrfToken, getProviders, signIn, getSession} from "next-auth/react"
import  Router  from "next/router";
import { useState } from "react";
export default function SignIn({ csrfToken , providers }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const signinUser = async (e) => {
        e.preventDefault();
        let options = { redirect: false, email, password}
        const res = await signIn("credentials", options)
        setMessage(null)
        if (res?.error) {
            setMessage(res.error)
        }

        //console.log(res)
      //console.log(email, password)
     return Router.push("/")
    }

    const signupUser = async (e)=>{
        e.preventDefault();
        setMessage(null)

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        let data = await res.json()
        if (data.message) {
            setMessage(data.message)
        }
        if (data.message == "Registrado correctamente"){
            let options = { redirect: false, email, password }
            const res = await signIn("credentials", options)
              return Router.push("/")
        }
    }

 



    return (
        <>
        
            <form action="">
                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                <label>
                    Email address
                    <input type="email" id="email" name="email" value={email} 
                    onChange={e => setEmail(e.target.value)} />
                </label>
            <label>
                    Password
                    <input type="email" id="email" name="email" value={password}
                onChange={e => setPassword(e.target.value)} />
            </label>
            <p style={{color: 'red'}}>{message}</p>
            <button onClick={(e) => signinUser(e)}>Sign with credentials</button>
            <button onClick={(e) => signupUser(e)}>Sign up</button>
            </form>
        
        
       
        {Object.values(providers).map((provider) => {
            if (provider.name === "Email" || provider.name === "Credentials") {
                return;
            }
            return (<div key={provider.name}>
                <button onClick={() => signIn(provider.id)}>
                    Sign in with {provider.name}
                </button>
            </div>)
        })}

        </>
    )
}

export async function getServerSideProps(context) {
    const { req } = context;
    const session = await getSession({ req})
    if (session){
        return {
            redirect: { destination: "/"}
        }
    }
    const csrfToken = await getCsrfToken(context)
    const providers = await getProviders()

    return {
        props: { csrfToken, providers},
    }
}

