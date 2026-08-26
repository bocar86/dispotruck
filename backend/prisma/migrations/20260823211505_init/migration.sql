-- CreateTable
CREATE TABLE "entreprises" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "siret" VARCHAR(14),
    "adresse" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entreprises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chauffeurs" (
    "id" SERIAL NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "prenom" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "mot_de_passe" VARCHAR(255) NOT NULL,
    "telephone" VARCHAR(15),
    "num_permis" VARCHAR(20),
    "type_permis" VARCHAR(5),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chauffeurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" SERIAL NOT NULL,
    "titre" VARCHAR(100) NOT NULL,
    "date" DATE NOT NULL,
    "heure" TIME NOT NULL,
    "lieu" VARCHAR(200),
    "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente',
    "entreprise_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disponibilites" (
    "id" SERIAL NOT NULL,
    "statut" VARCHAR(20) NOT NULL DEFAULT 'en_attente',
    "date_reponse" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mission_id" INTEGER NOT NULL,
    "chauffeur_id" INTEGER NOT NULL,

    CONSTRAINT "disponibilites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "entreprises_email_key" ON "entreprises"("email");

-- CreateIndex
CREATE UNIQUE INDEX "chauffeurs_email_key" ON "chauffeurs"("email");

-- AddForeignKey
ALTER TABLE "missions" ADD CONSTRAINT "missions_entreprise_id_fkey" FOREIGN KEY ("entreprise_id") REFERENCES "entreprises"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilites" ADD CONSTRAINT "disponibilites_mission_id_fkey" FOREIGN KEY ("mission_id") REFERENCES "missions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disponibilites" ADD CONSTRAINT "disponibilites_chauffeur_id_fkey" FOREIGN KEY ("chauffeur_id") REFERENCES "chauffeurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
