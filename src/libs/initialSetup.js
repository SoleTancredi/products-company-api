import Role from '../models/Role';

//la idea es crear por defecto inicialmente los roles en la api
export const createRoles = async () => {
    try{
        const count = await Role.estimatedDocumentCount(); //busca si ya existen roles

        if(count > 0) return; //si hay termina

        //si no hay crea todos estos roles
        const values = await Promise.all([
            new Role({name: "user"}).save(),
            new Role({name: "moderator"}).save(),
            new Role({name: "admin"}).save()
        ])

        console.log(values);

    }catch(error){
        console.error(error);
    }
}