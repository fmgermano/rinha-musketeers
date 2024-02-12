class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }

    static BadRequest(message = 'Requisição inválida') {
        return new ApiError(400, message);
    }

    static NotFound(message = 'Não encontrado') {
        return new ApiError(404, message);
    }

    static UnprocessableEntity(message = 'Entidade não processável') {
        return new ApiError(422, message);
    }
}