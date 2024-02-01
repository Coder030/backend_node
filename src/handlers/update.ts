import prisma from "../db"

//Get all
export const getUpdates = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id
    },
    include: {
      updates: true
    }
  })
  const updates  =products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates]
  }, [])
  res.json( {data: updates} )
} 

//Get one
export const getOneUpdate = async (req, res) => {
  const id = req.params.id

  const update = await prisma.update.findFirst({
    where: {
      id: req.params.id
    }
  })  

  res.json({data: update})
}

export const createUpdate = async (req, res) => {
  const product = await prisma.product.findUnique({
    // data: {
    //   name: req.body.name,
    //   belongsToId: req.user.id
    // }
    where: {
      id: req.body.productId,
    }
  })

  if(!product){
    req.json({message: 'wrong id sent'})
  }

  const update = await prisma.update.create({
    data:req.body
  })

  res.json({data: update})
}

export const updateUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    }, 
    include: {
      updates: true
    }
  })

  
  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates]
  }, [])
    

  const match = updates.find(update => update.id === req.params.id)


  if(!match){
    return res.json({message: 'no match'})
  }

  const updatedUpdate = await prisma.update.update({
    where: {
      id: req.params.id
    },
    data:req.body
  })
  
  res.json({data: updatedUpdate})
}

export const deleteUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    }, 
    include: {
      updates: true
    }
  })

  const updates = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates]
  }, [])

  const match = updates.find(update => update.id === req.params.id)

  if(!match){
    res.json({
      data: 'no match'
    })
  }
  const deleted = await prisma.update.delete({
    where:{
      id: req.params.id
    },
  })
  res.json({data: deleted})
}