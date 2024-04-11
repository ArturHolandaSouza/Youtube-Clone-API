import { pool } from '../../../mysql';
import { v4 as uuidv4 } from 'uuid'
import { compare, hash } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { Request, Response, response } from 'express';

class UserRepository {
    create(request: Request, response: Response) {
        const { name, email, password } = request.body;
        pool.getConnection((err: any, conection: any) => {
            hash(password, 10, (err, hash) => {
                if (err) {
                    response.status(500).json(err);
                }
                conection.query(
                    'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
                    [uuidv4(), name, email, hash],
                    (error: any, results: any, fields: any) => {
                        conection.release();
                        if (error) {
                            response.status(400).json(error);
                        }
                        response.status(200).json({ message: 'Usuário criado com sucesso' });
                    }
                )
            })
        })
    }

    login(request: Request, response: Response) {
        const { email, password } = request.body;
        pool.getConnection((err: any, conection: any) => {
            conection.query(
                'SELECT * FROM users WHERE email = ?',
                [email],
                (error: any, results: any, fields: any) => {
                    conection.release();
                    if (error) {
                        response.status(400).json({ error: "Erro na sua autenticação" });
                    }
                    compare(password, results[0].password, (err, result) => {
                        if (err) {
                            response.status(400).json({ error: "Erro na sua autenticação" });
                        }
                        if (result) {
                            // jsonwebtoken
                            const token = sign({
                                id: results[0].user_id,
                                email: results[0].email
                            }, process.env.SECRET as string, { expiresIn: "1d" })
                            return response.status(200).json({ token: token, message: 'Autenticado com sucesso' });
                        }
                    })
                }
            )
        })
    }


    getUser(request: any, response: any){
        const decode: any = verify(request.headers.authorization, process.env.SECRET as string);
        if(decode.email){
            pool.getConnection((error,conn) =>{
                conn.query(
                    'SELECT * from users WHERE email=?',
                    [decode.email],
                    (error, resultado, fields) => {
                        conn.release();
                        if (error){
                            return response.status(400).send({
                                error: error,
                                response: null
                            })
                        }

                        return response.status(201).send({
                            user: {
                                nome: resultado[0].name,
                                email: resultado[0].email,
                                id: resultado[0].user_id
                            }
                        })
                    }
                )
            })
        }
    }

}

export { UserRepository };