const criterias = [
    {
        title: 'Année',
        field: 'annee_tournage',
        data: Array(100).fill((new Date()).getFullYear() - 1).map((cum, val) => (++cum - val) + '' )
    },
    {   
        title: 'Arrondissement',
        field: 'ardt_lieu',
        data: Array(20).fill(75000).map((cum, val) => (++cum + val) + '')
    },
    {
        title: 'Type',
        field: 'type_tournage',
        data: ['Long métrage', 'Série TV', 'Téléfilm']
    },
];

export default criterias;