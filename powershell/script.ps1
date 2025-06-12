# Caminho para salvar o arquivo JSON
$outputFile = "metrics-k8s.json"

# Função para converter valores de memória em bytes
function Convert-ToBytes {
    param (
        [string]$value
    )

    if ($value -match '^(\d+)([KMG]i)$') {
        $num = [int]$matches[1]
        $unit = $matches[2]
        switch ($unit) {
            'Ki' { return $num * 1KB }
            'Mi' { return $num * 1MB }
            'Gi' { return $num * 1GB }
        }
    }
    elseif ($value -match '^\d+$') {
        return [long]$value  # já está em bytes
    }
    else {
        return $value  # retorna o valor original se não for memória
    }
}

# Verifica se o Metrics Server está disponível
try {
    $topPodsRaw = kubectl top pods --all-namespaces
}
catch {
    Write-Error "Erro ao executar 'kubectl top pods'. Verifique se o Metrics Server está instalado e configurado corretamente."
    exit 1
}

# Coleta de informações adicionais
$nodes = kubectl get nodes -o json | ConvertFrom-Json
$namespaces = kubectl get namespaces -o json | ConvertFrom-Json

# Informações por nó
$nodeMetrics = @()
foreach ($node in $nodes.items) {
    $nodeMetrics += [PSCustomObject]@{
        name        = $node.metadata.name
        nodeInfo    = $node.status.nodeInfo
        addresses   = ($node.status.addresses | Where-Object { $_.type -eq 'ExternalIP' }).address
        status      = $node.status.conditions[-1].type
        capacity    = @{
            cpu = $node.status.capacity.cpu
            'ephemeral-storage' = Convert-ToBytes $node.status.capacity.'ephemeral-storage'
            memory = Convert-ToBytes $node.status.capacity.memory
            pods = [int]$node.status.capacity.pods
        }
        conditions = $node.status.conditions
    }
}

# Coleta de métricas dos pods
$topPods = $topPodsRaw | Select-Object -Skip 1 | ForEach-Object {
    $cols = ($_ -split "\s+")
    [PSCustomObject]@{
        namespace = $cols[0]
        pod       = $cols[1]
        cpu       = $cols[2]
        memory    = Convert-ToBytes $cols[3]
    }
}



# Resultado final
$result = [PSCustomObject]@{
    timestamp  = (Get-Date).ToString("o") 
    nodes      = $nodeMetrics
    podMetrics = $topPods
    namespaces = ($namespaces.items | Select-Object -ExpandProperty metadata | Select-Object -ExpandProperty name)
}

# Salvar como JSON
$result | ConvertTo-Json -Depth 5 | Out-File -FilePath $outputFile -Encoding utf8
