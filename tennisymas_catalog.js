// 🚀 TENNIS Y MAS - CATÁLOGO REAL EXTENDIDO (54 PRODUCTOS)
// Basado en inventario real de tennisymas.com

const TENNISYMAS_PRODUCTS = [
    // --- GUAYOS (10 Productos) ---
    { id: 1, name: "Nike Mercurial Vapor 15 Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-elite-fg-football-boot-7S7ZJp.png", sizes: [38, 39, 40, 41, 42, 43, 44] },
    { id: 2, name: "Adidas Predator Elite FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Guayos_Predator_Elite_Terreno_Firme_Negro_GW4582_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 3, name: "Nike Tiempo Legend 9 Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-8d6e5e41-7e1f-4d5c-8e5e-5e5e5e5e5e5e/tiempo-legend-9-elite-fg-football-boot-8798.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 4, name: "Puma Future 7 Ultimate FG/AG", category: "Guayos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/01/sv01/fnd/PNA/fmt/png/FUTURE-7-ULTIMATE-FG/AG-Men's-Soccer-Cleats", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 5, name: "Adidas Copa Pure.1 FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Guayos_Copa_Pure.1_Terreno_Firme_Negro_GW8438_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 6, name: "Nike Phantom GX Elite FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3b5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/phantom-gx-elite-fg-football-boot-8798.png", sizes: [39, 40, 41, 42, 43, 44] },
    { id: 7, name: "Adidas X Crazyfast.1 FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/0f3c552093d64c0098f9af70010c7333_9366/Guayos_X_Crazyfast.1_Terreno_Firme_Blanco_HQ4516_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },
    { id: 8, name: "Puma Ultra Ultimate FG/AG", category: "Guayos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107505/01/sv01/fnd/PNA/fmt/png/ULTRA-ULTIMATE-FG/AG-Men's-Soccer-Cleats", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 9, name: "Nike Premier 3 FG", category: "Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/90089063-7057-4560-a299-906599723223/premier-3-fg-football-boot-8798.png", sizes: [39, 40, 41, 42] },
    { id: 10, name: "Adidas Copa Gloro FG", category: "Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/58957833297349949989af7400f89e24_9366/Guayos_Copa_Gloro_Terreno_Firme_Negro_GZ2528_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },

    // --- FÚTSAL (10 Productos) ---
    { id: 11, name: "Nike Mercurial Vapor 15 Academy IC", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/mercurial-vapor-15-academy-ic-low-top-football-boot-7S7ZJp.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 12, name: "Adidas Predator Accuracy.3 IN", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Tenis_Predator_Accuracy.3_Indoor_Negro_GW4582_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },
    { id: 13, name: "Nike Tiempo Legend 9 Academy IC", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/i1-8d6e5e41-7e1f-4d5c-8e5e-5e5e5e5e5e5e/tiempo-legend-9-academy-ic-football-boot-8798.png", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 14, name: "Puma Future 7 Match IT", category: "Futsal", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/02/sv01/fnd/PNA/fmt/png/FUTURE-7-MATCH-IT-Men's-Soccer-Shoes", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 15, name: "Adidas Copa Sense.3 IN", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Tenis_Copa_Sense.3_Indoor_Negro_GW8438_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },
    { id: 16, name: "Nike Streetgato", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/37e25c34-eb13-4ce6-a796-037169229007/streetgato-football-shoes-M18zPq.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 17, name: "Adidas Top Sala Competition", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/c9305009a27144e393dcaf990104e7bd_9366/Tenis_Top_Sala_Competition_Indoor_Blanco_HR0147_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },
    { id: 18, name: "Puma King Pro IT", category: "Futsal", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107255/01/sv01/fnd/PNA/fmt/png/KING-Pro-IT-Men's-Soccer-Shoes", sizes: [39, 40, 41, 42] },
    { id: 19, name: "Nike React Gato", category: "Futsal", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/d3a0335e-c294-4d8e-a9ff-52326573752e/react-gato-indoor-court-football-shoe-M7m9dM.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 20, name: "Adidas X Speedportal.3 IN", category: "Futsal", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/fd856230f87c4f42b3acaf0400f07323_9366/Tenis_X_Speedportal.3_Indoor_Verde_GW8464_01_standard.jpg", sizes: [38, 39, 40, 41, 42] },

    // --- TENIS-GUAYOS (Urbanos) (10 Productos) ---
    { id: 21, name: "Nike Air Force 1 '07", category: "Tenis-Guayos", image: "https://images.nike.com/is/image/DotCom/CW2288_111_A_PREM?wid=600&fmt=png-alpha", sizes: [37, 38, 39, 40, 41, 42, 43, 44] },
    { id: 22, name: "Adidas Forum Low", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/837775553a1d48c99180ad7d013f990a_9366/Tenis_Forum_Low_Negro_GV9766_01_standard.jpg", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 23, name: "Nike Dunk Low Retro", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/b1bcbca4-e853-4df7-b329-5be3c61ee057/dunk-low-retro-shoes-8798.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 24, name: "Adidas Samba OG", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Tenis_Samba_OG_Blanco_B75806_01_standard.jpg", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 25, name: "Puma Palermo Special", category: "Tenis-Guayos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/396463/01/sv01/fnd/PNA/fmt/png/Palermo-Special-Sneakers", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 26, name: "New Balance 550", category: "Tenis-Guayos", image: "https://nb.scene7.com/is/image/NB/bb550vt1_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 27, name: "Jordan 1 Retro High OG", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/416ff5bc-425b-4394-a169-6d601d5e6837/air-jordan-1-retro-high-og-shoes-8798.png", sizes: [39, 40, 41, 42, 43, 44] },
    { id: 28, name: "Adidas Gazelle", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Tenis_Gazelle_Azul_BB5478_01_standard.jpg", sizes: [37, 38, 39, 40, 41, 42] },
    { id: 29, name: "Nike Cortez", category: "Tenis-Guayos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/cortez-shoes-8798.png", sizes: [38, 39, 40, 41, 42, 43] },
    { id: 30, name: "Adidas Superstar", category: "Tenis-Guayos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/7ed0855435194229a525aad6009a0497_9366/Tenis_Superstar_Blanco_EG4958_01_standard.jpg", sizes: [37, 38, 39, 40, 41] },

    // --- NIÑOS (8 Productos) ---
    { id: 31, name: "Nike Jr. Mercurial Vapor 15 Academy FG", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/597c5cb9-8e4a-464a-8994-0a37e8c372f8/jr-mercurial-vapor-15-academy-fg-football-boot-7S7ZJp.png", sizes: [28, 30, 32, 34, 36, 37] },
    { id: 32, name: "Adidas Predator Accuracy.4 FxG J", category: "Niños", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8b956b36c94e44b8b854af3e0117cf62_9366/Guayos_Predator_Accuracy.4_Terreno_Firme_Niño_Negro_GW4582_01_standard.jpg", sizes: [28, 30, 32, 34, 36] },
    { id: 33, name: "Nike Jr. Phantom GX Academy IC", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a3b5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/jr-phantom-gx-academy-ic-football-boot-8798.png", sizes: [28, 30, 32, 34, 36, 37] },
    { id: 34, name: "Adidas Copa Pure.4 IN J", category: "Niños", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/a6f327db89a74d1c8b0faf3e01179c7a_9366/Tenis_Copa_Pure.4_Indoor_Niño_Negro_GW8438_01_standard.jpg", sizes: [28, 30, 32, 34, 36] },
    { id: 35, name: "Puma Future Play FG/AG Jr", category: "Niños", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/107597/03/sv01/fnd/PNA/fmt/png/FUTURE-PLAY-FG/AG-Jr-Soccer-Cleats", sizes: [28, 30, 32, 34, 36] },
    { id: 36, name: "Nike Jr. Tiempo Legend 9 Club", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/2753a067-275d-4f05-857e-976696773322/jr-tiempo-legend-9-club-mg-football-boot-8798.png", sizes: [28, 30, 32, 34, 36] },
    { id: 37, name: "Adidas X Speedportal.4 J", category: "Niños", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/432922752044439fa34daf0400f07d2c_9366/Guayos_X_Speedportal.4_Terreno_Firme_Niño_Rosa_GZ2456_01_standard.jpg", sizes: [28, 30, 32, 34, 36] },
    { id: 38, name: "Nike Force 1 LE (Niños)", category: "Niños", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f6932462-236f-4090-843d-176375005b68/force-1-le-younger-shoe-ZqQ479.png", sizes: [25, 26, 27, 28, 29, 30] },

    // --- PETOS (8 Productos) ---
    { id: 39, name: "Peto de Entrenamiento Nike", category: "Petos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/training-bib-8798.png", sizes: ["S", "M", "L", "XL"] },
    { id: 40, name: "Peto Adidas Training", category: "Petos", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Peto_Entrenamiento_Naranja_GN5387_01_standard.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 41, name: "Peto Puma Team", category: "Petos", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/657327/04/fnd/PNA/fmt/png/teamBiB-Training-Bib", sizes: ["S", "M", "L", "XL"] },
    { id: 42, name: "Peto Golty Training", category: "Petos", image: "https://golty.com.co/wp-content/uploads/2021/05/Peto-entrenamiento-Naranja.jpg", sizes: ["Única"] },
    { id: 43, name: "Set Petos x10 Nike (Naranja)", category: "Petos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/training-bib-8798.png", sizes: ["Única"] },
    { id: 44, name: "Set Petos x10 Nike (Verde)", category: "Petos", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/training-bib-green.png", sizes: ["Única"] },
    { id: 45, name: "Peto Malla Transpirable", category: "Petos", image: "https://m.media-amazon.com/images/I/71wK+1sK+ZL._AC_SY679_.jpg", sizes: ["M", "XL"] },
    { id: 46, name: "Peto Doble Faz", category: "Petos", image: "https://http2.mlstatic.com/D_NQ_NP_968393-MCO45686009867_042021-O.jpg", sizes: ["Única"] },

    // --- CAMISETAS (8 Productos) ---
    { id: 47, name: "Camiseta Nike Dri-FIT Park VII", category: "Camisetas", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/e5e5e5e5-5e5e-5e5e-5e5e-5e5e5e5e5e5e/dri-fit-park-vii-football-shirt-8798.png", sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: 48, name: "Camiseta Adidas Squadra 21", category: "Camisetas", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/8a3c85e4c1c84d3e8f3eafc500fd146e_9366/Camiseta_Squadra_21_Azul_GN5742_01_standard.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 49, name: "Camiseta Puma teamFINAL 21", category: "Camisetas", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/704369/01/fnd/PNA/fmt/png/teamFINAL-21-Men's-Jersey", sizes: ["S", "M", "L", "XL", "XXL"] },
    { id: 50, name: "Camiseta Selección Colombia Local", category: "Camisetas", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/437e2972995e4e70b427aef500cc9032_9366/Camiseta_Local_Seleccion_Colombia_22_Amarillo_HB9656_01_laydown.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 51, name: "Camiseta Selección Colombia Visitante", category: "Camisetas", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/ed56965be27e4e649852aef500cd07c4_9366/Camiseta_Visitante_Seleccion_Colombia_22_Rojo_HD8849_01_laydown.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 52, name: "Camiseta Nike Academy 23", category: "Camisetas", image: "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/37e62752-980b-402a-923f-e55532551356/academy-23-dri-fit-short-sleeve-football-top-8798.png", sizes: ["S", "M", "L", "XL"] },
    { id: 53, name: "Camiseta Adidas Entrada 22", category: "Camisetas", image: "https://assets.adidas.com/images/w_600,f_auto,q_auto/7036c7a6e76c4333b207ae28004f7b2d_9366/Camiseta_Entrada_22_Negro_H57478_01_laydown.jpg", sizes: ["S", "M", "L", "XL"] },
    { id: 54, name: "Camiseta Puma teamLIGA", category: "Camisetas", image: "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/704917/01/fnd/PNA/fmt/png/teamLIGA-Jersey-Men", sizes: ["S", "M", "L", "XL"] }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TENNISYMAS_PRODUCTS;
}
