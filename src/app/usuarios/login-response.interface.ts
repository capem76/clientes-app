export interface LoginResponse {
    access_token:   string;
    token_type:     string;
    refresh_token:  string;
    expires_in:     number;
    scope:          string;
    info_adicional: string;
    apellido:       string;
    nombre:         string;
    email:          string;
    jti:            string;
}
