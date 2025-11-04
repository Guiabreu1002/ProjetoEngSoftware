import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import User from "@/models/user";
import connectDB from "../db/conection";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      
      // ===============================================
      // AQUI ESTÁ A LÓGICA DE AUTORIZAÇÃO COM MONGODB
      // ===============================================
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email e senha são obrigatórios.");
        }

        try {
          // 1. Conectar ao banco de dados
          await connectDB();

          // 2. Encontrar o usuário pelo email
          // Usamos .select('+password') para forçar o Mongoose a incluir
          // o campo 'password', que definimos como 'select: false' no Schema.
          const user = await User.findOne({ 
            email: credentials.email 
          }).select('+password');

          // 3. Se o usuário não for encontrado
          if (!user) {
            console.log("Usuário não encontrado com o email:", credentials.email);
            // Retornar null informa ao NextAuth que a autenticação falhou
            return null;
          }

          // 4. Verificar se a senha está correta
          const passwordsMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // 5. Se a senha estiver incorreta
          if (!passwordsMatch) {
            console.log("Senha incorreta para o usuário:", credentials.email);
            return null;
          }

          // 6. Se tudo estiver OK, retorne o objeto do usuário
          // O NextAuth usará isso para criar a sessão (e o JWT)
          console.log("Login bem-sucedido para:", user.email);
          return user; 

        } catch (error) {
          console.error("Erro na função authorize:", error);
          // Retornar null em caso de qualquer erro
          return null;
        }
      },
    }),
  ],
  
  // Configuração de sessão com JWT
  session: {
    strategy: "jwt",
  },
  
  // Callbacks para adicionar mais dados ao token/sessão (opcional, mas útil)
  callbacks: {
    // Este callback é chamado sempre que um JWT é criado ou atualizado
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Adiciona o ID do usuário ao token
        token.username = user.username;
      }
      return token;
    },
    // Este callback é chamado sempre que uma sessão é verificada
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; // Adiciona o ID do usuário à sessão
        session.user.username = token.username;
      }
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };